import { Page, TestInfo } from '@playwright/test';
import { setupConsoleCollector, setupNetworkCollector, expectNoBrokenImages } from './assertions';

/**
 * ReportCollector wraps and standardizes E2E quality validations:
 * - Collects and asserts console errors
 * - Collects and asserts network failures
 * - Detects and asserts broken images
 */
export class ReportCollector {
  private consoleCollector;
  private networkCollector;

  constructor(private page: Page) {
    this.consoleCollector = setupConsoleCollector(page);
    this.networkCollector = setupNetworkCollector(page);
  }

  /**
   * Run structural page checks and attach findings to the Playwright test run.
   */
  public async verifyPageLoad(testInfo: TestInfo) {
    // 1. Broken images check
    await expectNoBrokenImages(this.page, testInfo);

    // 2. Console error check and attachment
    await this.consoleCollector.attachIfAny(testInfo);
    this.consoleCollector.assertNoErrors();

    // 3. Network request validation
    await this.networkCollector.attachIfAny(testInfo);
    this.networkCollector.assertNoCriticalFailures();
  }

  /**
   * Return collected browser console logs
   */
  public getConsoleErrors() {
    return this.consoleCollector.getErrors();
  }

  /**
   * Return collected network errors
   */
  public getNetworkFailures() {
    return this.networkCollector.getFailures();
  }
}
