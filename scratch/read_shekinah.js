import fs from 'fs';

const htmlPath = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\ecba4b72-380d-4675-983f-169e2d72f38a\\.system_generated\\steps\\1905\\content.md';
const content = fs.readFileSync(htmlPath, 'utf8');

// Print all images
const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
const imgs = [];
let match;
while ((match = imgRegex.exec(content)) !== null) {
  imgs.push(match[1]);
}
console.log(`All ${imgs.length} images:`);
imgs.forEach((url, i) => console.log(`${i}: ${url}`));

// Check for iframe
const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/g;
let ifmatch;
while ((ifmatch = iframeRegex.exec(content)) !== null) {
  console.log('Found iframe:', ifmatch[1]);
}

// Search for any other script containing data or links
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let smatch;
let sCount = 0;
while ((smatch = scriptRegex.exec(content)) !== null) {
  const scriptText = smatch[1];
  if (scriptText.includes('http') || scriptText.includes('image') || scriptText.includes('cards') || scriptText.includes('Array')) {
    console.log(`Script ${sCount} (length ${scriptText.length}) contains keywords. Preview:`, scriptText.substring(0, 500));
  }
  sCount++;
}
