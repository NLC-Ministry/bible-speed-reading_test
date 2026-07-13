const fs = require('fs');
const content = fs.readFileSync('dist/app.abccac47.js', 'utf8');
const index = content.indexOf('Lazy-loading module');
if (index !== -1) {
  console.log("Found:", content.slice(index - 100, index + 300));
} else {
  console.log("Not found!");
}
