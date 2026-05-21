const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jyjhpqtqbwtxxgijxetq.supabase.co';
const supabaseKey = 'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase.from('exam_resources').select('*').limit(2);
    console.log(data);
}
check();
