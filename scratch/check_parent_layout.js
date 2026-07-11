import fs from 'fs';

const html = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.html', 'utf8');
const lines = html.split('\n');

const lineIndex = 901; // 0-based is 900
for (let i = lineIndex - 35; i < lineIndex + 5; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
