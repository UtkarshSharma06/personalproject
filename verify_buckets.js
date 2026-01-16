import { createClient } from '@supabase/supabase-js';

// Using the keys I found in .env
const supabase = createClient(
    'https://jyjhpqtqbwtxxgijxetq.supabase.co',
    'sb_publishable_LZduUlJ96GYtgyo0l-iTzw_P-8Glk_v'
);

async function check() {
    console.log("Checking buckets...");
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error("Error listing buckets:", error.message);
    } else {
        console.log("Buckets found:", data.map(b => b.name));
        if (data.find(b => b.name === 'learning-assets')) {
            console.log("SUCCESS: 'learning-assets' bucket exists.");
        } else {
            console.log("FAILURE: 'learning-assets' bucket MISSING.");
        }
    }
}

check();
