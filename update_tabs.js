const fs = require('fs');

// PWNavbar.tsx
let pwNavbar = fs.readFileSync('src/components/home/PWNavbar.tsx', 'utf8');

// Replace standard font sizes and colors
pwNavbar = pwNavbar.replace(/text-slate-700/g, 'text-slate-900');
pwNavbar = pwNavbar.replace(/font-semibold/g, 'font-bold');
pwNavbar = pwNavbar.replace(/text-\[13px\] xl:text-\[14px\]/g, 'text-[15px] xl:text-[16px]');

fs.writeFileSync('src/components/home/PWNavbar.tsx', pwNavbar);
console.log('PWNavbar updated.');

// PublicNavbar.tsx
let publicNavbar = fs.readFileSync('src/components/PublicNavbar.tsx', 'utf8');

// Replace standard font sizes and colors for the links
// The links currently use: "text-[12px] font-bold tracking-tight transition-colors", isLightTheme ? "text-slate-600 hover:text-indigo-600" : "text-white/70 hover:text-white"
publicNavbar = publicNavbar.replace(/text-\[12px\] font-bold tracking-tight/g, 'text-[15px] lg:text-[16px] font-bold tracking-tight');
publicNavbar = publicNavbar.replace(/text-slate-600 hover:text-indigo-600/g, 'text-slate-900 hover:text-indigo-600');

fs.writeFileSync('src/components/PublicNavbar.tsx', publicNavbar);
console.log('PublicNavbar updated.');

