const fs = require('fs');
const ts = require('typescript');

const fileName = 'js/modules/plan.js';
const sourceCode = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
  fileName,
  sourceCode,
  ts.ScriptTarget.ES2022,
  true,
  ts.ScriptKind.JS
);

// Get syntax diagnostics from the sourceFile directly
const diagnostics = sourceFile.parseDiagnostics || [];
console.log("TypeScript parser diagnostics count:", diagnostics.length);
diagnostics.forEach(d => {
  const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, d.start);
  console.log(`Error at line ${line + 1}, col ${character + 1}: ${d.messageText}`);
});
