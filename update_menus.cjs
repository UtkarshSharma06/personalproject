const fs = require('fs');
const dir = 'd:/italostudy/italostudy-public-seo/public/';
const files = [
  'cent-s-mock.html', 'cent-s-exam-preparation-book-pdf-free-download.html', 'cent-s.html', 
  'imat-mock.html', 'imat.html', 'resources.html', 
  'roadmap.html', 'updates.html', 'status.html'
];

const newMenu = `        <!-- Mobile Menu Container -->
        <div id="mobile-menu" class="absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] backdrop-blur-3xl border bg-white/95 border-slate-200 lg:hidden flex-col gap-6 shadow-2xl z-50 opacity-0 invisible transition-all duration-300 pointer-events-none" style="display: flex;">
            <div class="flex flex-col gap-4">
                <a href="/exams" class="text-lg font-black tracking-tight text-slate-900">Exams</a>
                <div class="grid grid-cols-2 gap-2 pl-4">
                    <a href="/imat-exam-ultimate-guide-2026" class="text-sm font-bold text-slate-500 hover:text-indigo-600">IMAT 2026 Guide</a>
                    <a href="/cent-s-exam-ultimate-guide" class="text-sm font-bold text-slate-500 hover:text-indigo-600">CEnT-S Guide</a>
                </div>
            </div>
            <a href="/resources" class="text-lg font-black tracking-tight text-slate-700 hover:text-indigo-600">Resources</a>
            <a href="/pricing" class="text-lg font-black tracking-tight text-slate-700 hover:text-indigo-600">Pricing</a>
            <a href="/blog" class="text-lg font-black tracking-tight text-slate-700 hover:text-indigo-600">Blog</a>
            <a href="https://store.italostudy.com" class="text-lg font-black tracking-tight text-slate-700 hover:text-indigo-600">Store</a>
            <a href="/contact" class="text-lg font-black tracking-tight text-slate-700 hover:text-indigo-600">Contact</a>
            <div class="pt-4 border-t border-slate-100 flex flex-col gap-4">
                <a href="https://app.italostudy.com/auth" class="w-full">
                    <button class="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-indigo-600 text-white">Log in</button>
                </a>
            </div>
        </div>`;

for (const file of files) {
  if (!fs.existsSync(dir + file)) {
      console.log('Skipping ' + file);
      continue;
  }
  let content = fs.readFileSync(dir + file, 'utf8');
  
  // Replace the mobile menu block
  // Using a robust regex to find the Mobile Menu Container up to the closing div of mobile-menu
  // The original menu had 8 <a> tags and 1 button tag and 1 svg tag inside. We can match up to the login button.
  // We'll match <!-- Mobile Menu Container --> and everything up to <div id="root"> or </header> or <section
  content = content.replace(/<!-- Mobile Menu Container -->[\s\S]*?(?=<!-- Hero|<\/header>|<!-- Main|<!-- Background|<section|<div id="root">)/i, newMenu + '\n\n    ');
  
  // Now update the script
  const oldScript = /const mobileMenuClose = document\.getElementById\('mobile-menu-close'\);[\s\S]*?if\s*\(mobileMenuToggle\s*&&\s*mobileMenuClose\s*&&\s*mobileMenu\)[\s\S]*?}\s*\n/m;
  const newScript = `if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('invisible');
                mobileMenu.classList.toggle('opacity-0');
                mobileMenu.classList.toggle('pointer-events-none');
            });
        }
`;
  content = content.replace(oldScript, newScript);
  
  // Special case for files that might have 'const mobileMenuClose...' but diff script body
  const altOldScript = /const mobileMenuClose = document\.getElementById\('mobile-menu-close'\);/g;
  content = content.replace(altOldScript, '// removed close btn');
  
  fs.writeFileSync(dir + file, content);
  console.log('Updated ' + file);
}
