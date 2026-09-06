import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const projectsDir = path.resolve('public/projects');

async function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (/\.(png|jpeg|jpg)$/i.test(entry.name) && !entry.name.endsWith('.webp')) {
      const ext = path.extname(entry.name);
      const base = path.basename(entry.name, ext);
      const outPath = path.join(dir, `${base}.webp`);
      
      console.log(`Converting ${entry.name} -> ${base}.webp`);
      await sharp(fullPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outPath);
      
      const oldSize = fs.statSync(fullPath).size;
      const newSize = fs.statSync(outPath).size;
      console.log(`  ${(oldSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${((1 - newSize/oldSize)*100).toFixed(1)}%)`);
    }
  }
}

await processDir(projectsDir);
console.log('Conversion complete!');
