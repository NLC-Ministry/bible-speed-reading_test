import fs from 'fs';

const js = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\plan.js', 'utf8');
const lines = js.split('\n');

for (let i = 4660; i < 4750; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
