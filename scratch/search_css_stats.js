import fs from 'fs';

const css = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\index.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('profile-personal-stats-grid') || line.includes('profile-stat-card') || line.includes('stat-bento')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
