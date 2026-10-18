import sharp from 'sharp';
import fs from 'fs';
(async () => {
  const inPath = 'src/assets/profile.jpg';
  if (!fs.existsSync(inPath)) {
    console.error('input not found:', inPath);
    process.exit(1);
  }
  await sharp(inPath).resize(800, 800, { fit: 'cover', position: 'centre' }).jpeg({ quality: 80 }).toFile('src/assets/profile-800.jpg');
  await sharp('src/assets/profile-800.jpg').webp({ quality: 80 }).toFile('src/assets/profile.webp');
  await sharp(inPath).resize(400, 400, { fit: 'cover', position: 'centre' }).webp({ quality: 80 }).toFile('src/assets/profile-400.webp');
  fs.renameSync('src/assets/profile-800.jpg', 'src/assets/profile.jpg');
  console.log('optimized images written: profile.jpg, profile.webp, profile-400.webp');
})();
