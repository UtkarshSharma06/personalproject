const fs = require('fs');
const path = require('path');
const dir = 'd:/italostudy/italostudy-public-seo/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const results = {};
files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const menuStart = content.indexOf('id="mobile-menu"');
    if (menuStart === -1) return;
    
    // Find the end of the mobile menu div by counting nested divs
    let pos = menuStart;
    let depth = 0;
    let foundStart = false;
    while (pos < content.length) {
        if (content.substring(pos, pos + 4) === '<div') {
            depth++;
            foundStart = true;
            pos += 4;
        } else if (content.substring(pos, pos + 6) === '</div') {
            depth--;
            pos += 6;
            if (foundStart && depth === 0) break;
        } else {
            pos++;
        }
    }
    const menuContent = content.substring(menuStart, pos);
    const links = [...menuContent.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    results[file] = links;
});
console.log(JSON.stringify(results, null, 2));
