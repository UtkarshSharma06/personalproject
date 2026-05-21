const fs = require('fs');
const path = require('path');
const dir = 'd:/italostudy/italostudy-public-seo/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const hrefs = {};
files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const matches = content.matchAll(/href="([^"]+)"/g);
    for (const match of matches) {
        const href = match[1];
        if (href.startsWith('/') && !href.startsWith('//')) {
            hrefs[href] = (hrefs[href] || 0) + 1;
        }
    }
});
const sorted = Object.entries(hrefs).sort((a, b) => b[1] - a[1]);
console.log('--- Internal Links Audit ---');
sorted.forEach(([href, count]) => {
    console.log(`${count.toString().padStart(4)}: ${href}`);
});
