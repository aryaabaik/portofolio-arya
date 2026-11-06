const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install dependencies
try {
  require('clean-css');
  require('terser');
} catch {
  console.log('Installing minification tools...');
  execSync('npm install clean-css terser', { stdio: 'inherit' });
}

const CleanCSS = require('clean-css');
const { minify } = require('terser');

const CSS_DIR = 'src/main/resources/static/css';
const JS_DIR = 'src/main/resources/static/js';

async function minifyCSS() {
  console.log('\nMinifying CSS files...');
  const files = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css') && !f.endsWith('.min.css'));
  
  for (const file of files) {
    const filePath = path.join(CSS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(content);
    
    const output = new CleanCSS({
      level: 2,
      compatibility: 'ie11'
    }).minify(content);
    
    if (output.errors.length > 0) {
      console.error(`✗ ${file}:`, output.errors);
      continue;
    }
    
    const minPath = filePath.replace('.css', '.min.css');
    fs.writeFileSync(minPath, output.styles);
    
    const minSize = Buffer.byteLength(output.styles);
    const savings = ((originalSize - minSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${file}: ${(originalSize/1024).toFixed(1)}KB -> ${(minSize/1024).toFixed(1)}KB (${savings}% saved)`);
  }
}

async function minifyJS() {
  console.log('\nMinifying JS files...');
  const files = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));
  
  for (const file of files) {
    const filePath = path.join(JS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(content);
    
    try {
      const result = await minify(content, {
        compress: {
          dead_code: true,
          drop_console: false,
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          toplevel: false
        },
        format: {
          comments: false
        }
      });
      
      if (result.error) {
        console.error(`✗ ${file}:`, result.error);
        continue;
      }
      
      const minPath = filePath.replace('.js', '.min.js');
      fs.writeFileSync(minPath, result.code);
      
      const minSize = Buffer.byteLength(result.code);
      const savings = ((originalSize - minSize) / originalSize * 100).toFixed(1);
      
      console.log(`✓ ${file}: ${(originalSize/1024).toFixed(1)}KB -> ${(minSize/1024).toFixed(1)}KB (${savings}% saved)`);
    } catch (err) {
      console.error(`✗ ${file}:`, err.message);
    }
  }
}

async function main() {
  console.log('Starting minification...');
  await minifyCSS();
  await minifyJS();
  console.log('\n✓ Minification complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
