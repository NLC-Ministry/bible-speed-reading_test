import fs from 'fs';

const js = fs.readFileSync('c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\plan.js', 'utf8');
const lines = js.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('renderTeamStatsAnalysisDashboard') || line.includes('team-growth-chart')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
