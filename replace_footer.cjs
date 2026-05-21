const fs = require('fs');
const path = require('path');

const newFooter = `    <footer class="py-12 bg-slate-50 border-t border-slate-200 relative z-10 overflow-hidden text-left">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
                <!-- Brand Column -->
                <div class="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start gap-5">
                    <img src="/logo.webp" alt="Italostudy Logo" class="h-8 w-auto object-contain" width="140" height="35" loading="lazy">
                    <p class="text-[11px] font-medium text-slate-500 max-w-xs leading-relaxed">
                        Empowering students for Italian entrance exams with expert-led preparation and strategic guidance for success.
                    </p>
                    <div class="flex gap-3">
                        <a href="https://www.instagram.com/italostudycom" target="_blank" class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all border border-slate-200 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                        </a>
                        <a href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" target="_blank" class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-green-600 transition-all border border-slate-200 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                        </a>
                    </div>
                </div>

                <!-- Column 1: Company -->
                <div class="flex flex-col gap-4">
                    <h4 class="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Company</h4>
                    <ul class="flex flex-col gap-2.5">
                        <li><a href="/about" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">About Us</a></li>
                        <li><a href="/blog" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Blog & News</a></li>
                        <li><a href="https://store.italostudy.com" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Marketplace</a></li>
                        <li><a href="/pricing" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing Plans</a></li>
                        <li><a href="/contact" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</a></li>
                        <li><a href="/status" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Status</a></li>
                    </ul>
                </div>

                <!-- Column 2: CENT-S 2026 -->
                <div class="flex flex-col gap-4">
                    <h4 class="text-[10px] font-bold text-slate-900 uppercase tracking-widest">CENT-S 2026</h4>
                    <ul class="flex flex-col gap-2.5">
                        <li><a href="/cent-s-exam-ultimate-guide" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Ultimate Guide 2026</a></li>
                        <li><a href="/cent-s-syllabus-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Detailed Syllabus 2026</a></li>
                        <li><a href="/cent-s-exam-pattern-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Exam Pattern & Scoring</a></li>
                        <li><a href="/cent-s-cutoff-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Historical Cutoff Trends</a></li>
                        <li><a href="/cent-s-mock-test-free-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Free Full-Length Mock</a></li>
                        <li><a href="/cent-s-previous-year-papers-pdf" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Past Papers (2020-2025)</a></li>
                    </ul>
                </div>

                <!-- Column 3: IMAT 2026 -->
                <div class="flex flex-col gap-4">
                    <h4 class="text-[10px] font-bold text-slate-900 uppercase tracking-widest">IMAT 2026</h4>
                    <ul class="flex flex-col gap-2.5">
                        <li><a href="/imat-exam-ultimate-guide-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Ultimate Guide 2026</a></li>
                        <li><a href="/imat-syllabus-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Detailed Syllabus 2026</a></li>
                        <li><a href="/imat-exam-pattern-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Exam Pattern & Scoring</a></li>
                        <li><a href="/imat-cutoff-trends-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Historical Cutoff Trends</a></li>
                        <li><a href="/imat-preparation-strategy-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">90-Day Prep Strategy</a></li>
                        <li><a href="/imat-mock-test-free-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Free Mock Test 2026</a></li>
                    </ul>
                </div>

                <!-- Column 4: Study in Italy -->
                <div class="flex flex-col gap-4">
                    <h4 class="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Study in Italy</h4>
                    <ul class="flex flex-col gap-2.5">
                        <li><a href="/study-in-italy-guide-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Study in Italy Guide 2026</a></li>
                        <li><a href="/study-in-italy/universities-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Top Universities List</a></li>
                        <li><a href="/study-in-italy/without-ielts" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Study Without IELTS</a></li>
                        <li><a href="/study-in-italy/tuition-fees-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">Tuition Fees 2026</a></li>
                        <li><a href="/study-in-italy/how-to-apply" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">How to Apply (Steps)</a></li>
                        <li><a href="/imat-exam-ultimate-guide-2026" class="text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors">IMAT Exam Prep 2026</a></li>
                    </ul>
                </div>
            </div>

            <div class="pt-8 border-t border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-8">
                <div class="flex flex-col items-center lg:items-start gap-1">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 ITALOSTUDY EDUCATION TECHNOLOGIES. ALL RIGHTS RESERVED.
                    </p>
                    <div class="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                        <a href="/privacy" class="text-[9px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</a>
                        <a href="/terms" class="text-[9px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Terms</a>
                        <a href="/refund" class="text-[9px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Refunds</a>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                    <img src="/payments/visa.webp" alt="visa" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/mastercard.webp" alt="mastercard" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/amex.webp" alt="amex" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/paypal.webp" alt="paypal" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/applepay.webp" alt="applepay" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/googlepay.webp" alt="googlepay" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/ideal.webp" alt="ideal" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/pix.webp" alt="pix" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/upi.webp" alt="upi" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                    <img src="/payments/cashapp.webp" alt="cashapp" class="h-4 md:h-5 w-auto object-contain transition-transform hover:scale-110 opacity-90">
                </div>
            </div>
        </div>
    </footer>`;

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir);

let count = 0;
for (const file of files) {
    if (file.endsWith('.html')) {
        const filePath = path.join(publicDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const footerRegex = /<footer\b[^>]*>[\s\S]*?<\/footer>/i;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, newFooter);
            fs.writeFileSync(filePath, content, 'utf8');
            count++;
            console.log(`Updated footer in ${file}`);
        }
    }
}

console.log(`Done! Updated ${count} files.`);
