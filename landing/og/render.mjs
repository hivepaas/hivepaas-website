// Renders og-image.svg to public/og-image.png, the image a shared link to
// hivepaas.com shows. Run from landing/: node og/render.mjs
import sharp from 'sharp';

await sharp('og/og-image.svg', { density: 72 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');
console.log('public/og-image.png written');
