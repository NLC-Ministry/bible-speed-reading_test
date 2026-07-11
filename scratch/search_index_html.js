import fs from 'fs';

const html = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('profile') || line.toLowerCase().includes('stats') || line.includes('統計')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
