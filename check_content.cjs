const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const supabaseKey = 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase.from('blog_posts').select('slug, content').eq('slug', 'estimated-cost-studying-in-italy').single();
    if (data && data.content) {
        let contentStr = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        console.log('Contains Cloudinary URL in content?', contentStr.includes('cloudinary.com'));
        if (contentStr.includes('cloudinary.com')) {
            const match = contentStr.match(/https:\/\/res\.cloudinary\.com[^"'\s>]+/);
            console.log('First Cloudinary URL in content:', match ? match[0] : 'Not found');
        }
    }
}
check();
