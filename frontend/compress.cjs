const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'c:/React/summit-efficience/frontend/public';
const files = ['buffet.png', 'piscine.png', 'salle_manger.png', 'piscine_2.png', 'enfants.png', 'salons.png'];

async function compress() {
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.png', '.webp'));
    if (fs.existsSync(input)) {
      console.log(`Compressing ${file}...`);
      await sharp(input).webp({ quality: 75 }).toFile(output);
      console.log(`Done ${file} -> .webp`);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
}
compress();
