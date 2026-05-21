const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');
const original = html.match(/<meta property="og:image" content=".*?"\s*\/>/);
console.log('Match og:image:', original ? original[0] : 'NO MATCH');
