const fs = require('fs');
const path = require('path');
const dir = 'd:/italostudy/italostudy-public-seo/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Extract Desktop Nav
    const desktopNavStart = content.indexOf('<nav');
    const desktopNavEnd = content.indexOf('</nav>', desktopNavStart);
    const desktopNav = content.substring(desktopNavStart, desktopNavEnd + 6);
    const desktopLinks = [...desktopNav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const desktopLabels = [...desktopNav.matchAll(/>([^<]+)<\/a>/g)].map(m => m[1].trim());
    
    // Extract Mobile Nav
    const mobileMenuStart = content.indexOf('id="mobile-menu"');
    if (mobileMenuStart === -1) return;
    
    // Simplified mobile menu extraction
    let pos = mobileMenuStart;
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
    const mobileContent = content.substring(mobileMenuStart, pos);
    const mobileLinks = [...mobileContent.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const mobileLabels = [...mobileContent.matchAll(/>([^<]+)</g)].map(m => m[1].trim()).filter(l => l.length > 0 && l !== 'Log in');

    console.log(`--- File: ${file} ---`);
    console.log('Desktop Links:', desktopLinks);
    console.log('Mobile Links:', mobileLinks);
    
    // Check for "Exams" vs "Syllabus"
    const hasSyllabusMobile = mobileLabels.some(l => l.toLowerCase().includes('syllabus'));
    const hasExamsDesktop = desktopLabels.some(l => l.toLowerCase().includes('exams')) || desktopNav.includes('Exams');
    
    if (hasSyllabusMobile) console.log('  [!] Found Syllabus in Mobile Menu');
    if (hasExamsDesktop) console.log('  [!] Found Exams in Desktop Menu');
});
