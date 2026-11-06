const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install sharp if not available
try {
  require('sharp');
} catch {
  console.log('Installing sharp...');
  execSync('npm install sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const IMAGES_DIR = 'src/main/resources/static/images';
const QUALITY = 82;
const MAX_WIDTH = 1200;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  
  // Skip small images
  if (sizeKB < 50) {
    console.log(`Skipping ${path.basename(filePath)} (${sizeKB.toFixed(2)} KB)`);
    return;
  }

  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    let pipeline = sharp(filePath);
    
    // Resize if too large
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    await pipeline
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    const webpSizeKB = webpStats.size / 1024;
    const savings = ((sizeKB - webpSizeKB) / sizeKB * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(filePath)}: ${sizeKB.toFixed(0)}KB -> ${webpSizeKB.toFixed(0)}KB (${savings}% saved)`);
  } catch (err) {
    console.error(`✗ Failed ${path.basename(filePath)}:`, err.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      await optimizeImage(fullPath);
    }
  }
}

console.log('Starting image optimization...\n');
processDirectory(IMAGES_DIR).then(() => {
  console.log('\n✓ Image optimization complete!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
