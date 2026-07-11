import fs from 'fs';

const html = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('今日完成') || line.includes('team-today-completion-rate') || line.includes('group-section')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
