import fs from 'fs';
import path from 'path';

async function fetchPage(p) {
  const url = p === 1 
    ? 'https://dailyverses.net/tc/100%E6%9C%AC%E6%9C%80%E5%8F%97%E6%AD%A1%E8%BF%8E%E7%9A%84%E8%81%96%E7%B6%93%E9%87%91%E5%8F%A5'
    : `https://dailyverses.net/tc/100%E6%9C%AC%E6%9C%80%E5%8F%97%E6%AD%A1%E8%BF%8E%E7%9A%84%E8%81%96%E7%B6%93%E9%87%91%E5%8F%A5?p=${p}`;
  
  console.log(`Fetching page ${p}: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch page ${p}: ${res.statusText}`);
  }
  return await res.text();
}

async function scrapeAll() {
  const allVerses = [];
  
  for (let p = 1; p <= 4; p++) {
    const html = await fetchPage(p);
    const regex = /<span class="v2">([^<]+)<\/span>[\s\S]*?class="vc">([^<]+)<\/a>/g;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      const rawText = match[1];
      const cleanedText = rawText.replace(/\s+/g, '').trim();
      const source = match[2].replace(/\s+/g, ' ').trim();
      allVerses.push({ text: `「${cleanedText}」`, source });
      count++;
    }
    console.log(`Extracted ${count} verses from page ${p}.`);
  }

  console.log(`Total extracted: ${allVerses.length} verses.`);

  // Write to scratch file for backup
  fs.writeFileSync('C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\ecba4b72-380d-4675-983f-169e2d72f38a\\scratch\\top_100_verses.json', JSON.stringify(allVerses, null, 2));

  // Now, let's load home.js and replace the DAILY_VERSES array definition!
  const homeJsPath = 'c:\\Users\\admin\\Desktop\\Bible-study\\js\\modules\\home.js';
  let homeJsContent = fs.readFileSync(homeJsPath, 'utf8');

  // Find start and end of DAILY_VERSES by normalizing newlines first
  const startMark = 'const DAILY_VERSES = [';
  const endMark = '];\n\nexport function updateDashboardView()';

  let normalized = homeJsContent.replace(/\r\n/g, '\n');
  const startIndex = normalized.indexOf(startMark);
  const endIndex = normalized.indexOf(endMark);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find DAILY_VERSES block in home.js! Indices:', startIndex, endIndex);
    return;
  }

  // Format array nicely
  const formattedArray = `const DAILY_VERSES = [\n` + 
    allVerses.map(v => `  { text: ${JSON.stringify(v.text)}, source: ${JSON.stringify(v.source)} }`).join(',\n') +
    `\n];`;

  const newContent = normalized.substring(0, startIndex) + formattedArray + normalized.substring(endIndex + 2); // keep the empty lines and export function

  fs.writeFileSync(homeJsPath, newContent, 'utf8');
  console.log('Successfully updated home.js with 100 popular verses!');
}

scrapeAll().catch(console.error);
