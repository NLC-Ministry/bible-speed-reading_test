import fs from 'fs';

const cssContent = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = cssContent.split('\n');

lines.forEach((line, idx) => {
  if (line.trim().startsWith('button {') || line.trim().startsWith('button,') || line.trim().startsWith('.bento-card button') || line.trim().startsWith('.card-col button')) {
    console.log(`Line ${idx + 1}: ${line}`);
    for (let i = 1; i <= 15; i++) {
      if (lines[idx + i]) console.log(`  + ${lines[idx + i]}`);
    }
    console.log('---');
  }
});
