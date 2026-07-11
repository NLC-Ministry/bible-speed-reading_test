import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

const lineIndex1 = 8300;
for (let i = lineIndex1; i < lineIndex1 + 20; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
console.log('===');
const lineIndex2 = 8810;
for (let i = lineIndex2; i < lineIndex2 + 20; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
