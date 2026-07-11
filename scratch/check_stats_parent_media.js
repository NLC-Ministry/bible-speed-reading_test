import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

for (let i = 8640; i < 8685; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
