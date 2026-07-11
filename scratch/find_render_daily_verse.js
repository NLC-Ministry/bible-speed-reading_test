import fs from 'fs';

const jsContent = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\home.js', 'utf8');

const regex = /renderDailyVerse/gi;
let match;
while ((match = regex.exec(jsContent)) !== null) {
  const index = match.index;
  console.log('Match found at index:', index);
  console.log('Preview:', jsContent.substring(index - 100, index + 300));
  console.log('---');
}
