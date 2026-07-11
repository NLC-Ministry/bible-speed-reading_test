import fs from 'fs';

const html = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.html', 'utf8');
const lines = html.split('\n');

for (let i = 1130; i < 1300; i++) {
  if (lines[i] && (lines[i].includes('canvas') || lines[i].includes('chart') || lines[i].includes('圖') || lines[i].includes('section') || lines[i].includes('card'))) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
  }
}
