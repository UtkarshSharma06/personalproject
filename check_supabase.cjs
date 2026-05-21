const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const supabaseKey = 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v'; // from blog-post-dynamic.js
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('blog_posts').select('slug, featured_image').limit(5);
    console.log(data);
}
check();
