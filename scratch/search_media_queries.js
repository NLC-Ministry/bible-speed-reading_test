import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('@media') && line.includes('max-width')) {
    console.log(`Line ${idx + 1}: ${line}`);
    // Print 5 lines below
    for (let i = 1; i <= 8; i++) {
      if (lines[idx + i]) console.log(`  + ${lines[idx + i]}`);
    }
    console.log('---');
  }
});
