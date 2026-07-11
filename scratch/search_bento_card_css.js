import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('.bento-card')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
