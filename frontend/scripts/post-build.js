const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const nodeModulesDir = path.resolve(__dirname, '../node_modules');

console.log('--- Running Mafina Trans Post-Build Optimizations ---');

// 1. Minify and Inline compiled CSS files in dist/
try {
  const files = fs.readdirSync(distDir);
  const cssFiles = files.filter(f => f.startsWith('main.') && f.endsWith('.css'));
  const htmlPath = path.join(distDir, 'index.html');

  if (cssFiles.length === 0) {
    console.warn('Warning: No compiled main.*.css files found in dist/');
  } else if (!fs.existsSync(htmlPath)) {
    console.warn('Warning: index.html not found in dist/, cannot inline CSS.');
  } else {
    let html = fs.readFileSync(htmlPath, 'utf8');

    cssFiles.forEach(file => {
      const filePath = path.join(distDir, file);
      console.log(`Minifying and inlining CSS file: ${file}`);
      let css = fs.readFileSync(filePath, 'utf8');

      const originalSize = css.length;

      // Simple regex-based CSS minification
      css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
      css = css.replace(/\s+/g, ' '); // Compress whitespace
      css = css.replace(/\s*([\{\}:;,])\s*/g, '$1'); // Remove spaces around braces/colons/commas
      css = css.replace(/;}/g, '}'); // Remove unnecessary trailing semicolons
      css = css.trim();

      const minifiedSize = css.length;
      const savings = ((originalSize - minifiedSize) / 1024).toFixed(2);
      console.log(`Successfully minified ${file}. Saved ${savings} KB (${originalSize} -> ${minifiedSize} bytes).`);

      // Escape dots in file name for regex
      const linkTagRegex = new RegExp(`<link[^>]*href="\\/${file.replace('.', '\\.')}"[^>]*>`, 'i');
      if (linkTagRegex.test(html)) {
        html = html.replace(linkTagRegex, `<style>${css}</style>`);
        console.log(`Successfully inlined ${file} into index.html.`);

        // Delete original css and map file to avoid double loading and clean dist
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted ${file} from dist/`);
          const mapFilePath = filePath + '.map';
          if (fs.existsSync(mapFilePath)) {
            fs.unlinkSync(mapFilePath);
            console.log(`Deleted ${file}.map from dist/`);
          }
        } catch (unlinkErr) {
          console.error(`Error deleting files:`, unlinkErr);
        }
      } else {
        // Fallback search if tag style is different
        const genericLinkTagRegex = new RegExp(`<link[^>]*href="[^"]*${file}"[^>]*>`, 'i');
        if (genericLinkTagRegex.test(html)) {
          html = html.replace(genericLinkTagRegex, `<style>${css}</style>`);
          console.log(`Successfully inlined ${file} via fallback into index.html.`);
          try {
            fs.unlinkSync(filePath);
            const mapFilePath = filePath + '.map';
            if (fs.existsSync(mapFilePath)) fs.unlinkSync(mapFilePath);
          } catch (unlinkErr) {}
        } else {
          console.warn(`Warning: Could not find link tag for ${file} in index.html.`);
        }
      }
    });

    fs.writeFileSync(htmlPath, html, 'utf8');
  }
} catch (err) {
  console.error('Error during CSS minification & inlining:', err);
}

// 2. Process, purge, and optimize FontAwesome
try {
  const faCssSrc = path.join(nodeModulesDir, '@fortawesome/fontawesome-free/css/all.min.css');
  const faFontsSrc = path.join(nodeModulesDir, '@fortawesome/fontawesome-free/webfonts');

  const faCssDestDir = path.join(distDir, 'css');
  const faFontsDestDir = path.join(distDir, 'webfonts');

  // Create dest dirs if not exist
  if (!fs.existsSync(faCssDestDir)) fs.mkdirSync(faCssDestDir, { recursive: true });
  if (!fs.existsSync(faFontsDestDir)) fs.mkdirSync(faFontsDestDir, { recursive: true });

  console.log('Optimizing, purging, and copying FontAwesome CSS...');
  if (fs.existsSync(faCssSrc)) {
    let css = fs.readFileSync(faCssSrc, 'utf8');

    // 2a. Recursive scan of src/ directory for used FontAwesome icons
    const usedIcons = new Set();
    const srcDir = path.resolve(__dirname, '../src');

    function walkDir(dir, callback) {
      if (!fs.existsSync(dir)) return;
      fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
          walkDir(dirPath, callback);
        } else {
          callback(dirPath);
        }
      });
    }

    walkDir(srcDir, (filePath) => {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(/fa-[a-z0-9-]+/g);
        if (matches) {
          matches.forEach(m => usedIcons.add(m));
        }
      }
    });

    console.log(`Found ${usedIcons.size} used FontAwesome icons:`, Array.from(usedIcons));

    // Define FontAwesome utility class prefixes to preserve
    const FA_UTILITIES = new Set([
      'fa', 'fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-brands', 
      'fa-2xs', 'fa-xs', 'fa-sm', 'fa-lg', 'fa-xl', 'fa-2xl', 'fa-3xl', 'fa-4xl', 'fa-5xl', 'fa-6xl', 'fa-7xl', 'fa-8xl', 'fa-9xl', 'fa-10xl',
      'fa-fw', 'fa-ul', 'fa-li', 'fa-border', 'fa-pull-left', 'fa-pull-right', 
      'fa-spin', 'fa-pulse', 'fa-spin-reverse', 'fa-spin-pulse', 'fa-beat', 'fa-fade', 'fa-beat-fade', 'fa-bounce', 'fa-shake',
      'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal', 'fa-flip-vertical',
      'fa-stack', 'fa-stack-1x', 'fa-stack-2x', 'fa-inverse', 'fa-sr-only', 'fa-sr-only-focusable', 
      'fa-classic', 'fa-sharp', 'fa-duotone', 'fa-light', 'fa-thin', 'fa-kit'
    ]);

    // 2b. Purge rules from CSS using a brace-matching parser to correctly preserve nested blocks
    const originalRules = [];
    let currentRule = '';
    let braceDepth = 0;

    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      currentRule += char;
      if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          originalRules.push(currentRule.trim());
          currentRule = '';
        }
      }
    }
    if (currentRule.trim()) {
      originalRules.push(currentRule.trim());
    }

    const keptRules = [];

    originalRules.forEach(rule => {
      const trimmedRule = rule.trim();
      if (!trimmedRule) return;

      // Keep @font-face rules
      if (trimmedRule.startsWith('@font-face')) {
        keptRules.push(trimmedRule);
        return;
      }

      // Keep nested blocks like @supports or @media as they contain base configurations
      if (trimmedRule.startsWith('@supports') || trimmedRule.startsWith('@media')) {
        keptRules.push(trimmedRule);
        return;
      }

      // In minified CSS, a rule is: selector{properties}
      // Scan ONLY the selector part for icon classes to prevent matching and discarding
      // important CSS custom property variables (like --fa-font-brands) in the body.
      const braceIndex = trimmedRule.indexOf('{');
      if (braceIndex !== -1) {
        const selector = trimmedRule.substring(0, braceIndex);
        const classMatches = selector.match(/fa-[a-z0-9-]+/g);
        if (classMatches) {
          // If there's a match in the selector, check if any class names are used or are utilities
          const isUsed = classMatches.some(cls => FA_UTILITIES.has(cls) || usedIcons.has(cls));
          if (isUsed) {
            keptRules.push(trimmedRule);
          }
        } else {
          // Keep rules that don't contain any icon-specific classes in the selector (e.g. :root, body, svg)
          keptRules.push(trimmedRule);
        }
      } else {
        // Fallback for rules without braces
        keptRules.push(trimmedRule);
      }
    });

    let purgedCss = keptRules.join('');

    // 2c. Strip overrides and inject font-display: swap;
    purgedCss = purgedCss.replace(/font-display\s*:\s*[^;\}]+;?/g, '');
    purgedCss = purgedCss.replace(/@font-face\s*\{/g, '@font-face{font-display:swap;');

    // 2d. Replace `:host,:root` with `:root` to ensure compatibility in browsers/environments that discard rules containing `:host` in global stylesheets
    purgedCss = purgedCss.replace(/:host\s*,\s*:root/g, ':root');

    fs.writeFileSync(path.join(faCssDestDir, 'all.min.css'), purgedCss, 'utf8');
    const originalKb = (css.length / 1024).toFixed(1);
    const purgedKb = (purgedCss.length / 1024).toFixed(1);
    console.log(`FontAwesome CSS purged successfully: ${originalKb} KB -> ${purgedKb} KB.`);
  } else {
    console.error(`Error: FontAwesome source CSS not found at: ${faCssSrc}`);
  }

  console.log('Copying FontAwesome webfonts...');
  if (fs.existsSync(faFontsSrc)) {
    const fontFiles = fs.readdirSync(faFontsSrc);
    fontFiles.forEach(fontFile => {
      const srcPath = path.join(faFontsSrc, fontFile);
      const destPath = path.join(faFontsDestDir, fontFile);
      fs.copyFileSync(srcPath, destPath);
    });
    console.log(`Copied ${fontFiles.length} webfonts to dist/webfonts/`);
  } else {
    console.error(`Error: FontAwesome webfonts source dir not found at: ${faFontsSrc}`);
  }
} catch (err) {
  console.error('Error processing FontAwesome assets:', err);
}

// 3. Copy robots.txt to dist/
try {
  const robotsSrc = path.join(distDir, '../public/robots.txt');
  const robotsDest = path.join(distDir, 'robots.txt');
  console.log('Copying robots.txt to dist...');
  if (fs.existsSync(robotsSrc)) {
    fs.copyFileSync(robotsSrc, robotsDest);
    console.log('robots.txt successfully copied to dist/');
  } else {
    console.warn('Warning: robots.txt not found in public/');
  }
} catch (err) {
  console.error('Error copying robots.txt:', err);
}

console.log('--- Post-Build Optimizations Complete ---');
