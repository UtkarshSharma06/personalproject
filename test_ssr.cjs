const handler = async () => {
    const fs = require('fs');
    const path = require('path');
    
    // Mock the SSR function
    const templatePath = path.join(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    const safeImage = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/, '<meta property="og:image" content="' + safeImage + '" />');
    html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/, '<meta name="twitter:image" content="' + safeImage + '" />');
    
    const ogMatch = html.match(/<meta property="og:image" content=".*?"\s*\/>/);
    const twMatch = html.match(/<meta name="twitter:image" content=".*?"\s*\/>/);
    
    console.log('OG Image Match:', ogMatch ? ogMatch[0] : 'NO MATCH');
    console.log('Twitter Image Match:', twMatch ? twMatch[0] : 'NO MATCH');
};
handler();
