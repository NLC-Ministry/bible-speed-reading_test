import fs from 'fs';

const cssContent = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');

// Find any button styling
const regex = /button/gi;
let match;
const lines = cssContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('button') && (line.includes('#verse-card') || line.includes('.bento-card') || line.includes('.card-col') || line.includes('.verse-card'))) {
    console.log(`Line ${idx + 1}: ${line}`);
    // Print 5 lines below
    for (let i = 1; i <= 10; i++) {
      if (lines[idx + i]) console.log(`  + ${lines[idx + i]}`);
    }
    console.log('---');
  }
});
