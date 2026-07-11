import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

const start = 8673; // 0-based
for (let i = start; i < start + 65; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
