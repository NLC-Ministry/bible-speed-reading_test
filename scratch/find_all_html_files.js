import fs from 'fs';
import path from 'path';

function findHtml(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(findHtml(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

console.log(findHtml('c:\\Users\\admin\\Desktop\\Bible-study'));
