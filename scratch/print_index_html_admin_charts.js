import fs from 'fs';

const html = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.html', 'utf8');
const lines = html.split('\n');

for (let i = 1220; i < 1255; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
