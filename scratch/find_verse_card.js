import fs from 'fs';

const htmlPath = 'c:\\Users\\admin\\Desktop\\Bible-study\\index.html';
const content = fs.readFileSync(htmlPath, 'utf8');

const regex = /id=["'][^"']*verse[^"']*["']/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const index = match.index;
  console.log('Match found at index:', index);
  console.log('Preview:', content.substring(index - 50, index + 300));
  console.log('---');
}
