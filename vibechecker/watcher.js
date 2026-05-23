/**
 * VibeChecker — watcher.js
 * Main entry point. Watches src/ with Chokidar, debounces changes,
 * triggers validation, and renders results.
 *
 * Usage:
 *   node watcher.js
 *   node watcher.js --path ./src --url http://localhost:8000
 *   node watcher.js --once
 */

import chokidar from 'chokidar';
import chalk    from 'chalk';
import path     from 'path';
import fs       from 'fs';
import { fileURLToPath } from 'url';
import { ui }            from './ui.js';
import { runValidation } from './validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    watchPath: path.join(__dirname, '../frontend/src'),
    baseUrl:   'http://localhost:3003',
    debounce:  1200,
    once:      false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path'     && args[i + 1]) opts.watchPath = args[++i];
    if (args[i] === '--url'      && args[i + 1]) opts.baseUrl   = args[++i];
    if (args[i] === '--debounce' && args[i + 1]) opts.debounce  = parseInt(args[++i], 10);
    if (args[i] === '--once')                    opts.once       = true;
  }

  return opts;
}

// ─── State ────────────────────────────────────────────────────────────────────

let isValidating  = false;
let pendingFile   = null;
let debounceTimer = null;

// ─── Handle file change ───────────────────────────────────────────────────────

async function handleChange(filePath, opts) {
  const relative = path.relative(process.cwd(), path.resolve(filePath));

  if (isValidating) {
    pendingFile = relative;
    ui.queued();
    return;
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    isValidating = true;
    pendingFile  = null;

    ui.fileChanged(relative);
    ui.startSpinner('⏳ Initialising validation…');

    try {
      const { results, elapsed } = await runValidation(relative);
      ui.displayResults(results, relative, elapsed);
    } catch (err) {
      ui.displayCrash(err);
    } finally {
      ui.stopSpinner();
      isValidating = false;

      if (pendingFile) {
        const next  = pendingFile;
        pendingFile = null;
        await handleChange(next, opts);
      }
    }
  }, opts.debounce);
}

// ─── Startup checks ───────────────────────────────────────────────────────────

function checkEnvironment(watchPath) {
  if (!fs.existsSync(watchPath)) {
    fs.mkdirSync(watchPath, { recursive: true });
    return [`Watch path "${watchPath}" did not exist — created it.`];
  }
  return [];
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

async function boot() {
  const opts      = parseArgs();
  const watchPath = path.resolve(opts.watchPath);

  ui.clearScreen();
  ui.banner();

  const warnings = checkEnvironment(watchPath);
  warnings.forEach(w => ui.warn(w));
  if (warnings.length) console.log('');

  ui.watchingStatus(opts.watchPath, opts.baseUrl);

  // ── --once mode ────────────────────────────────────────────────────────────
  if (opts.once) {
    ui.info('Running in --once mode…');
    ui.startSpinner('Running full validation…');
    try {
      const { results, elapsed } = await runValidation('manual-trigger');
      ui.displayResults(results, 'manual-trigger', elapsed);
    } catch (err) {
      ui.displayCrash(err);
    } finally {
      ui.stopSpinner();
    }
    process.exit(0);
  }

  // ── File watcher ───────────────────────────────────────────────────────────
  const watcher = chokidar.watch(watchPath, {
    ignored: /(^|[/\\])(\.|node_modules|dist|build|\.next|\.cache)/,
    persistent:    true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 400,
      pollInterval:       100,
    },
  });

  watcher
    .on('change', fp => handleChange(fp, opts))
    .on('add',    fp => {
      ui.info(`New file: ${path.relative(process.cwd(), fp)}`);
      handleChange(fp, opts);
    })
    .on('unlink', fp => ui.fileDeleted(path.relative(process.cwd(), fp)))
    .on('error',  err => ui.warn(`Watcher error: ${err.message}`));

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = async () => {
    ui.goodbye();
    await watcher.close();
    process.exit(0);
  };

  process.on('SIGINT',  shutdown);
  process.on('SIGTERM', shutdown);
  process.stdin.resume();
}

boot().catch(err => {
  console.error(chalk.red('Fatal:'), err.message);
  process.exit(1);
});
