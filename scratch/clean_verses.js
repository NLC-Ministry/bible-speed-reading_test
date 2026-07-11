import fs from 'fs';

const homeJsPath = 'c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\home.js';
let content = fs.readFileSync(homeJsPath, 'utf8');

// Parse DAILY_VERSES block
const startMark = 'const DAILY_VERSES = [';
const endMark = '];\n\nexport function updateDashboardView()';

let normalized = content.replace(/\r\n/g, '\n');
const startIndex = normalized.indexOf(startMark);
const endIndex = normalized.indexOf(endMark);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find DAILY_VERSES block!');
  process.exit(1);
}

const blockText = normalized.substring(startIndex + startMark.length, endIndex);

// Process each line in the block to clean the spaces in the source field
// Pattern: source: "哥 林 多 前 書 13:4-5"
const lines = blockText.split('\n');
const cleanedLines = lines.map(line => {
  const match = line.match(/(source:\s*")([^"]+)(")/);
  if (match) {
    const rawSource = match[2]; // e.g., "哥 林 多 前 書 13:4-5"
    const parts = rawSource.trim().split(/\s+/);
    if (parts.length > 1) {
      const coords = parts[parts.length - 1]; // e.g., "13:4-5"
      const bookName = parts.slice(0, parts.length - 1).join(''); // e.g., "哥林多前書"
      const cleanedSource = `${bookName} ${coords}`;
      return line.replace(rawSource, cleanedSource);
    }
  }
  return line;
});

const newBlockText = cleanedLines.join('\n');
const newContent = normalized.substring(0, startIndex + startMark.length) + newBlockText + normalized.substring(endIndex);

fs.writeFileSync(homeJsPath, newContent, 'utf8');
console.log('Successfully cleaned all scripture source spaces in home.js!');
