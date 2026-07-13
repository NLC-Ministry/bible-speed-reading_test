const fs = require('fs');
const content = fs.readFileSync('js/modules/plan.js', 'utf8');
const INLINE_STYLE_COLOR_HEX = /style\s*=\s*["'][^"']*(?:color|background(?:-color)?)\s*:\s*[^"']*#[0-9a-f]{3,8}/gi;
let match;
while ((match = INLINE_STYLE_COLOR_HEX.exec(content)) !== null) {
  const lineNo = content.slice(0, match.index).split('\n').length;
  console.log(`Matched Line ${lineNo}: ${match[0]}`);
}
