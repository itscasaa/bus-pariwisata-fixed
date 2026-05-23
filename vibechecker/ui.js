/**
 * VibeChecker — ui.js
 * Handles all terminal UI rendering: banners, results, spinners, boxes.
 */

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';

// ─── Spinner instance (singleton) ─────────────────────────────────────────────
let activeSpinner = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (str, len = 40) => str.padEnd(len).slice(0, len);
const timestamp = () => chalk.dim(`[${new Date().toLocaleTimeString()}]`);
const divider = (color = 'cyan', char = '━', len = 52) =>
  chalk[color](char.repeat(len));

// ─── Public UI API ────────────────────────────────────────────────────────────

export const ui = {

  clearScreen() {
    process.stdout.write('\x1Bc');
  },

  banner() {
    const title    = chalk.cyan.bold('⚡  V I B E C H E C K E R');
    const subtitle = chalk.gray('AI-Style Development Monitoring System');
    const meta     = chalk.dim('v1.0.0  •  100% Local  •  Zero Cloud');
    const content  = `${title}\n${subtitle}\n\n${meta}`;

    console.log(
      boxen(content, {
        padding: { top: 1, bottom: 1, left: 4, right: 4 },
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: 'double',
        borderColor: 'cyan',
        textAlignment: 'center',
      })
    );
  },

  watchingStatus(watchPath, baseUrl) {
    console.log(divider('cyan'));
    console.log(chalk.cyan('  STATUS    ') + chalk.green('● MONITORING ACTIVE'));
    console.log(chalk.cyan('  WATCHING  ') + chalk.white(watchPath));
    console.log(chalk.cyan('  TARGET    ') + chalk.white(baseUrl));
    console.log(chalk.cyan('  READY     ') + chalk.gray('Waiting for file changes…'));
    console.log(divider('cyan'));
    console.log('');
  },

  fileChanged(filePath) {
    console.log('');
    console.log(divider('yellow'));
    console.log(
      chalk.yellow.bold('  📁 FILE CHANGED') +
      chalk.dim('  ' + timestamp())
    );
    console.log(chalk.white('  ' + filePath));
    console.log(divider('yellow'));
    console.log('');
  },

  fileDeleted(filePath) {
    console.log('');
    console.log(chalk.red('  🗑  FILE DELETED  ') + chalk.dim(filePath));
    console.log('');
  },

  startSpinner(text) {
    if (activeSpinner) activeSpinner.stop();
    activeSpinner = ora({
      text: chalk.cyan(text),
      spinner: 'dots12',
      color: 'cyan',
    }).start();
    return activeSpinner;
  },

  updateSpinner(text) {
    if (activeSpinner) activeSpinner.text = chalk.cyan(text);
  },

  stopSpinner() {
    if (activeSpinner) {
      activeSpinner.stop();
      activeSpinner = null;
    }
  },

  displayResults(results, changedFile, elapsed) {
    this.stopSpinner();
    console.log('');

    const passed  = results.filter(r => r.status === 'passed').length;
    const failed  = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const total   = results.length;
    const allGood = failed === 0;

    const headerColor = allGood ? 'green' : 'red';

    console.log(divider(headerColor));
    console.log(
      chalk[headerColor].bold(`  ${allGood ? '✅' : '❌'}  VALIDATION RESULTS`) +
      chalk.dim(`  ${elapsed}ms`)
    );
    console.log(divider(headerColor));
    console.log('');

    for (const result of results) {
      const icon    = result.status === 'passed' ? chalk.green('  ✓') :
                      result.status === 'skipped' ? chalk.yellow('  ⊘') :
                                                    chalk.red('  ✗');
      const nameStr = result.status === 'passed'
        ? chalk.green(pad(result.name, 38))
        : result.status === 'skipped'
          ? chalk.yellow(pad(result.name, 38))
          : chalk.red(pad(result.name, 38));
      const durStr  = chalk.dim(`${result.duration ?? '?'}ms`);
      console.log(`${icon}  ${nameStr} ${durStr}`);
    }

    console.log('');
    console.log(
      chalk.dim('  ') +
      chalk.green(`${passed} passed`) + chalk.dim('  ·  ') +
      chalk.red(`${failed} failed`) + chalk.dim('  ·  ') +
      chalk.yellow(`${skipped} skipped`) + chalk.dim('  ·  ') +
      chalk.dim(`${total} total`)
    );
    console.log('');

    const failedResults = results.filter(r => r.status === 'failed');
    if (failedResults.length > 0) {
      console.log(divider('red'));
      console.log(chalk.red.bold('  🔍 ERROR DETAILS'));
      console.log(divider('red'));
      for (const result of failedResults) {
        this._displayErrorBlock(result);
      }
    }

    const statusContent = allGood
      ? chalk.green.bold('✅  All systems operational\n') +
        chalk.dim(`   Triggered by: ${changedFile}`)
      : chalk.red.bold(`❌  ${failed} issue(s) detected\n`) +
        chalk.dim(`   Triggered by: ${changedFile}`);

    console.log(
      boxen(statusContent, {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: allGood ? 'round' : 'double',
        borderColor: allGood ? 'green' : 'red',
      })
    );

    console.log(chalk.dim(`  Watching for next change…`));
    console.log('');
  },

  _displayErrorBlock(result) {
    console.log('');
    console.log(chalk.red.bold(`  ● ${result.name}`));
    console.log('');

    if (result.error?.message) {
      console.log(chalk.red('  ERROR:'));
      result.error.message.split('\n').slice(0, 4).forEach(line =>
        console.log(chalk.redBright('    ' + line.trim()))
      );
      console.log('');
    }

    if (result.error?.location) {
      console.log(chalk.yellow('  LOCATION:'));
      console.log(chalk.yellowBright('    ' + result.error.location));
      console.log('');
    }

    if (result.error?.causes?.length) {
      console.log(chalk.yellow('  POSSIBLE CAUSE:'));
      result.error.causes.forEach(c => console.log(chalk.yellow('    • ' + c)));
      console.log('');
    }

    if (result.error?.fixes?.length) {
      console.log(chalk.cyan('  SUGGESTED FIX:'));
      result.error.fixes.forEach(f => console.log(chalk.cyanBright('    → ' + f)));
      console.log('');
    }

    if (result.impacted?.length) {
      console.log(chalk.magenta('  IMPACTED COMPONENTS:'));
      result.impacted.forEach(c => console.log(chalk.magenta('    ⚠  ' + c)));
      console.log('');
    }

    console.log(divider('red', '─', 52));
  },

  warn(message) {
    console.log(chalk.yellow(`  ⚠  ${message}`));
  },

  info(message) {
    console.log(chalk.cyan(`  ℹ  ${message}`));
  },

  displayCrash(err) {
    this.stopSpinner();
    console.log('');
    console.log(
      boxen(
        chalk.red.bold('💥 VIBECHECKER CRASHED\n\n') +
        chalk.red(err.message || String(err)) + '\n\n' +
        chalk.dim('VibeChecker will keep running and retry on next file change.'),
        { padding: 1, borderStyle: 'double', borderColor: 'red' }
      )
    );
    console.log('');
  },

  queued() {
    console.log(chalk.yellow(`  ⏸  Previous validation in progress — change queued`));
  },

  goodbye() {
    console.log('');
    console.log(
      boxen(
        chalk.cyan.bold('👋 VibeChecker stopped\n') +
        chalk.dim('Thanks for using VibeChecker'),
        {
          padding: { top: 0, bottom: 0, left: 2, right: 2 },
          margin: 1,
          borderStyle: 'round',
          borderColor: 'cyan',
          textAlignment: 'center',
        }
      )
    );
  },
};
