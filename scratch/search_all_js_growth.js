import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules';
const files = fs.readdirSync(dir);
files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('growth') || line.includes('growth-chart')) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
});
