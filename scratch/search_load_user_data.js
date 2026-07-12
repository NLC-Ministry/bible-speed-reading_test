import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\db.js', 'utf8');
const lines = content.split('\n');

let start = -1;
lines.forEach((line, idx) => {
  if (line.includes('async loadUserData(')) {
    start = idx;
  }
});

if (start !== -1) {
  for (let i = start; i < start + 100; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('loadUserData not found');
}
