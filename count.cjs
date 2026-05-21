const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const supabaseKey = 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase.from('blog_posts').select('slug, featured_image');
    const total = data.length;
    const empty = data.filter(d => !d.featured_image).length;
    const filled = data.filter(d => d.featured_image).length;
    console.log('Total:', total, 'Empty:', empty, 'Filled:', filled);
}
check();
