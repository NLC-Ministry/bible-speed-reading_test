import fs from 'fs';

const lines = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\home.js', 'utf8').split('\n');

const lineIndex = lines.findIndex(l => l.includes('function renderDailyVerse()'));
if (lineIndex !== -1) {
  console.log(`Found function renderDailyVerse() at line ${lineIndex + 1}:`);
  for (let i = Math.max(0, lineIndex - 5); i < Math.min(lines.length, lineIndex + 80); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('Not found');
}
