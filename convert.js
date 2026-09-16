const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

(async () => {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const files = ['photo1', 'photo2', 'photo3'];

  for (const file of files) {
    const heicPath = path.join(imagesDir, `${file}.heic`);
    const jpgPath = path.join(imagesDir, `${file}.jpg`);
    
    console.log(`Converting ${file}.heic to ${file}.jpg...`);
    
    try {
      if (fs.existsSync(heicPath)) {
        const inputBuffer = await promisify(fs.readFile)(heicPath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 1
        });
        
        await promisify(fs.writeFile)(jpgPath, outputBuffer);
        console.log(`Converted ${file} successfully.`);
        
        // Remove old HEIC file
        fs.unlinkSync(heicPath);
      } else {
        console.log(`${file}.heic does not exist, skipping.`);
      }
    } catch (e) {
      console.error(`Failed to convert ${file}:`, e);
    }
  }
})();
