/**
 * VibeChecker — validator.js
 * Orchestrates Playwright test execution and returns structured results.
 */

import { spawn }  from 'child_process';
import { ui }     from './ui.js';
import { parseError, staticLint } from './errorParser.js';
import path       from 'path';
import fs         from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PLAYWRIGHT_CONFIG = path.join(__dirname, 'playwright.config.js');
const TESTS_DIR         = path.join(__dirname, 'tests');

// ─── Run shell command ────────────────────────────────────────────────────────

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: __dirname,
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', d => { stdout += d.toString(); });
    proc.stderr?.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => resolve({ code, stdout, stderr }));
    proc.on('error', reject);
  });
}

// ─── Parse Playwright JSON report ────────────────────────────────────────────

function parsePlaywrightReport(report, changedFile) {
  const results = [];

  for (const suite of (report.suites || [])) {
    for (const spec of (suite.specs || [])) {
      for (const test of (spec.tests || [])) {
        const run      = test.results?.[test.results.length - 1] ?? {};
        const status   = run.status === 'passed' ? 'passed'
                       : run.status === 'skipped' ? 'skipped'
                       : 'failed';
        const duration = Math.round(run.duration ?? 0);

        let error = null;
        if (status === 'failed' && run.error) {
          error = parseError(
            { message: run.error.message, stack: run.error.stack, location: run.error.location },
            spec.title,
            changedFile,
          );
        }

        results.push({
          name:     spec.title || 'Unnamed test',
          status,
          duration,
          error,
          impacted: error?.impacted ?? [],
        });
      }
    }
  }

  if ((report.errors || []).length > 0 && results.length === 0) {
    for (const err of report.errors) {
      results.push({
        name:     'Configuration / Compile Error',
        status:   'failed',
        duration: 0,
        error:    parseError(err, 'config', changedFile),
        impacted: [],
      });
    }
  }

  return results;
}

// ─── Static analysis ─────────────────────────────────────────────────────────

function runStaticAnalysis(changedFile) {
  const results = [];
  const fullPath = path.resolve(changedFile);

  if (!fs.existsSync(fullPath)) return results;

  try {
    const content  = fs.readFileSync(fullPath, 'utf8');
    const warnings = staticLint(content, changedFile);

    results.push({
      name:     `Static Analysis: ${path.basename(changedFile)}`,
      status:   warnings.length > 0 ? 'failed' : 'passed',
      duration: 0,
      error: warnings.length > 0 ? {
        message:  'Code quality warnings detected',
        location: changedFile,
        causes:   warnings,
        fixes:    ['Review the warnings above', 'Run ESLint for detailed report'],
        impacted: [],
      } : null,
      impacted: [],
    });
  } catch { /* skip */ }

  return results;
}

// ─── Dependency impact detection ──────────────────────────────────────────────

function detectDependencyImpact(changedFile) {
  const changedBase = path.basename(changedFile, path.extname(changedFile));
  const impacted = [];

  if (!fs.existsSync(TESTS_DIR)) return impacted;

  fs.readdirSync(TESTS_DIR)
    .filter(f => f.endsWith('.spec.js') || f.endsWith('.test.js'))
    .forEach(testFile => {
      try {
        const content = fs.readFileSync(path.join(TESTS_DIR, testFile), 'utf8');
        if (content.includes(changedBase)) impacted.push(testFile);
      } catch { /* skip */ }
    });

  return impacted;
}

// ─── Main entry ──────────────────────────────────────────────────────────────

export async function runValidation(changedFile) {
  const startTime = Date.now();

  // Step 1: Static analysis
  ui.updateSpinner('Running static analysis…');
  const staticResults = runStaticAnalysis(changedFile);

  // Step 2: Dependency impact
  ui.updateSpinner('Checking dependency impact…');
  const impacted = detectDependencyImpact(changedFile);
  if (impacted.length > 0) {
    ui.info(`Dependency impact: ${impacted.join(', ')}`);
  }

  // Step 3: Playwright tests
  ui.updateSpinner('Launching browser tests…');

  if (!fs.existsSync(PLAYWRIGHT_CONFIG)) {
    return {
      results: [
        ...staticResults,
        { name: 'Browser Tests (skipped — no playwright.config.js)', status: 'skipped', duration: 0, error: null, impacted: [] },
      ],
      elapsed: Date.now() - startTime,
    };
  }

  let playwrightResults = [];

  try {
    const { code, stdout, stderr } = await runCommand('npx', [
      'playwright', 'test',
      '--config', PLAYWRIGHT_CONFIG,
      '--reporter=json',
      '--timeout=20000',
    ]);

    try {
      const report = JSON.parse(stdout);
      playwrightResults = parsePlaywrightReport(report, changedFile);
    } catch {
      const jsonMatch = stdout.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          playwrightResults = parsePlaywrightReport(JSON.parse(jsonMatch[1]), changedFile);
        } catch { /* fall through */ }
      }

      if (playwrightResults.length === 0 && code !== 0) {
        playwrightResults = [{
          name: 'Playwright Runner',
          status: 'failed',
          duration: 0,
          error: parseError(
            { message: stderr || stdout || `Exited with code ${code}`, stack: stderr },
            'runner', changedFile
          ),
          impacted: [],
        }];
      }
    }
  } catch {
    playwrightResults = [{
      name: 'Playwright (not installed — run: npm install)',
      status: 'skipped',
      duration: 0,
      error: null,
      impacted: [],
    }];
  }

  return {
    results: [...staticResults, ...playwrightResults],
    elapsed: Date.now() - startTime,
  };
}
