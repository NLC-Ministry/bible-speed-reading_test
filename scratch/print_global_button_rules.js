import fs from 'fs';

const cssContent = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = cssContent.split('\n');

const lineIndex = 5631; // 5632 in 1-based index
for (let i = lineIndex; i < lineIndex + 45; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
