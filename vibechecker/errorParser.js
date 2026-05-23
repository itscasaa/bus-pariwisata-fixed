/**
 * VibeChecker — errorParser.js
 * Parses raw error messages into structured objects.
 * Provides possible causes and suggested fixes based on error patterns.
 * 100% offline — no AI API needed.
 */

// ─── Error pattern rules ──────────────────────────────────────────────────────

const ERROR_RULES = [
  {
    pattern: /cannot read propert(?:y|ies) of (null|undefined)/i,
    causes: [
      'Object is null or undefined before access',
      'API response returned unexpected shape',
      'Async data not yet loaded when component renders',
      'Missing null/undefined guard',
    ],
    fixes: [
      'Use optional chaining: obj?.property',
      'Add nullish coalescing: obj ?? defaultValue',
      'Add loading state guard: if (!data) return null',
      'Verify API response shape with console.log(response)',
    ],
  },
  {
    pattern: /cannot read properties of undefined.*'(\w+)'/i,
    causes: [
      'Variable declared but never assigned',
      'Destructured prop is missing from parent',
      'State not initialized before use',
    ],
    fixes: [
      'Initialize state: const [data, setData] = useState({})',
      'Add default prop: function Comp({ cart = {} })',
      'Destructure safely: const { items = [] } = cart ?? {}',
    ],
  },
  {
    pattern: /typeerror/i,
    causes: [
      'Wrong data type passed to function',
      'Calling a non-function value',
      'Arithmetic on non-numeric type',
    ],
    fixes: [
      'Check variable types with typeof before use',
      'Add PropTypes or TypeScript types',
      'Validate data at component boundary',
    ],
  },
  {
    pattern: /referenceerror: (\w+) is not defined/i,
    causes: [
      'Variable used before declaration',
      'Import missing or typo in import name',
      'Scope issue — variable declared inside block',
    ],
    fixes: [
      'Add missing import at top of file',
      'Move declaration outside the block scope',
      'Check for typos in variable/function name',
    ],
  },
  {
    pattern: /cannot find module|module not found|failed to resolve/i,
    causes: [
      'npm package not installed',
      'Wrong relative import path',
      'File was renamed or moved',
      'Missing index.js in directory',
    ],
    fixes: [
      'Run: npm install',
      'Check import path is correct relative to file',
      'Verify file exists at expected location',
      'Add index.js to directory or update import path',
    ],
  },
  {
    pattern: /syntaxerror|unexpected token|unexpected end of/i,
    causes: [
      'Missing closing bracket, brace, or parenthesis',
      'Invalid JSON format',
      'JSX tag not properly closed',
    ],
    fixes: [
      'Check for missing }, ), or ] near error line',
      'Use a linter (ESLint) to highlight syntax issues',
      'Ensure all JSX tags are properly closed',
    ],
  },
  {
    pattern: /fetch failed|network error|econnrefused|failed to fetch/i,
    causes: [
      'Backend server is not running',
      'Wrong API URL or port',
      'CORS policy blocking request',
    ],
    fixes: [
      'Start your backend server first',
      'Check API base URL in .env or config file',
      'Add CORS headers on the server',
    ],
  },
  {
    pattern: /timeout|timed out|exceeded.*timeout/i,
    causes: [
      'Page took too long to load',
      'Selector not found within timeout window',
      'Heavy rendering blocking the thread',
    ],
    fixes: [
      'Increase Playwright timeout in playwright.config.js',
      'Verify selector exists on the page',
      'Add await waitForLoadState("networkidle")',
    ],
  },
  {
    pattern: /locator.*not found|element.*not found|no element found/i,
    causes: [
      'Selector changed in the HTML/JSX',
      'Element is conditionally hidden',
      'Page not fully loaded before query',
    ],
    fixes: [
      'Update selector in test to match current HTML',
      'Add await page.waitForSelector(selector)',
      'Use data-testid attributes for stable selectors',
    ],
  },
  {
    pattern: /cors|access-control-allow-origin/i,
    causes: [
      'API server missing CORS headers',
      'Request origin not whitelisted on server',
    ],
    fixes: [
      'Add cors middleware: app.use(cors())',
      'Whitelist your frontend origin on the server',
      'Use a proxy in vite.config.js or webpack config',
    ],
  },
  {
    pattern: /401|unauthorized|403|forbidden/i,
    causes: [
      'Missing or expired authentication token',
      'User lacks required permissions',
    ],
    fixes: [
      'Check token is attached to request headers',
      'Verify user session / localStorage token',
    ],
  },
  {
    pattern: /404|page not found|route not found/i,
    causes: [
      'Route not defined in router',
      'Typo in URL or navigation path',
    ],
    fixes: [
      'Add the route to your router configuration',
      'Check for typo in path string',
    ],
  },
];

// ─── Location extractor ───────────────────────────────────────────────────────

function extractLocation(stack) {
  if (!stack) return null;
  const lines = stack.split('\n');
  for (const line of lines) {
    if (
      line.includes('at ') &&
      !line.includes('node_modules') &&
      !line.includes('internal/') &&
      (line.includes('.js') || line.includes('.jsx') || line.includes('.php'))
    ) {
      const match = line.match(/\((.+?)\)|at (.+)$/);
      if (match) {
        const raw = (match[1] || match[2]).trim();
        return raw.replace(process.cwd() + '/', '').trim();
      }
    }
  }
  return null;
}

function extractPlaywrightLocation(playwrightError) {
  if (!playwrightError) return null;
  if (playwrightError.location) {
    const loc = playwrightError.location;
    return `${loc.file || ''}${loc.line ? ':' + loc.line : ''}${loc.column ? ':' + loc.column : ''}`;
  }
  return extractLocation(playwrightError.stack || playwrightError.message || '');
}

// ─── Component impact map ─────────────────────────────────────────────────────

const COMPONENT_MAP = {
  homepage:   ['Header', 'Hero', 'Footer', 'Navbar'],
  login:      ['LoginForm', 'AuthContext', 'TokenManager'],
  dashboard:  ['DashboardLayout', 'Sidebar', 'StatsCard'],
  checkout:   ['CartSummary', 'PaymentForm', 'OrderConfirmation'],
  profile:    ['UserCard', 'AvatarUpload', 'ProfileForm'],
  register:   ['RegisterForm', 'EmailValidator', 'PasswordStrength'],
  product:    ['ProductCard', 'ImageGallery', 'AddToCart'],
  cart:       ['CartItem', 'PriceCalculator', 'CartSummary'],
  api:        ['FetchService', 'AxiosInstance', 'APIErrorBoundary'],
  navigation: ['Navbar', 'Breadcrumb', 'RouterGuard'],
};

function detectImpacted(testName, changedFile) {
  const impacted = new Set();
  const nameLower = testName.toLowerCase();

  for (const [keyword, components] of Object.entries(COMPONENT_MAP)) {
    if (nameLower.includes(keyword)) {
      components.forEach(c => impacted.add(c));
    }
  }

  if (changedFile) {
    const base = changedFile.split('/').pop()?.replace(/\.(jsx?|tsx?|php)$/, '') || '';
    if (base) impacted.add(base);
  }

  return Array.from(impacted).slice(0, 4);
}

// ─── Main exports ─────────────────────────────────────────────────────────────

export function parseError(rawError, testName = '', changedFile = '') {
  const message  = rawError?.message || rawError?.toString() || 'Unknown error';
  const stack    = rawError?.stack || '';
  const location = extractPlaywrightLocation(rawError) || extractLocation(stack);

  const causes = [];
  const fixes  = [];
  const combined = `${message}\n${stack}`.toLowerCase();

  for (const rule of ERROR_RULES) {
    if (rule.pattern.test(combined)) {
      rule.causes.forEach(c => { if (!causes.includes(c)) causes.push(c); });
      rule.fixes.forEach(f => { if (!fixes.includes(f)) fixes.push(f); });
    }
  }

  if (causes.length === 0) {
    causes.push('Unexpected runtime error');
    fixes.push('Check browser console for more details');
    fixes.push('Add error boundary around this component');
  }

  return {
    message:  message.split('\n')[0].slice(0, 200),
    location,
    causes:   causes.slice(0, 4),
    fixes:    fixes.slice(0, 4),
    impacted: detectImpacted(testName, changedFile),
  };
}

export function staticLint(content, filePath) {
  const warnings = [];

  if (/\.(\w+)\.(\w+)/.test(content) && !content.includes('?.')) {
    warnings.push('Deep property access without optional chaining detected');
  }
  if (/console\.log\(/.test(content)) {
    warnings.push('console.log() statements found — remove before production');
  }
  if (/TODO|FIXME|HACK/.test(content)) {
    warnings.push('TODO/FIXME/HACK comments found in changed file');
  }
  if (/catch\s*\(\w+\)\s*\{\s*\}/.test(content)) {
    warnings.push('Empty catch block detected — errors will be silently swallowed');
  }

  return warnings;
}
