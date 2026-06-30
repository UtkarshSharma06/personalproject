require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

supabase.from('blogs').select('content').eq('slug', 'cent-s-exam-2027-complete-guide').single().then(res => {
    const content = typeof res.data.content === 'string' ? JSON.parse(res.data.content) : res.data.content;
    const raw = typeof content === 'object' ? content.body : content;
    const match = raw.match(/font-family[^;\"']+/g);
    console.log("Custom HTML Fonts:", match ? [...new Set(match)].slice(0,5) : 'No font-family inline styles found');
}).catch(console.error);
