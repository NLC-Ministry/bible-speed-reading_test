import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\home.js', 'utf8');
const lines = content.split('\n');

const lineIndex = lines.findIndex(l => l.includes('changeVerseCardBackground'));
if (lineIndex !== -1) {
  console.log(`Found changeVerseCardBackground at line ${lineIndex + 1}:`);
  for (let i = Math.max(0, lineIndex - 5); i < Math.min(lines.length, lineIndex + 40); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('Not found');
}
