
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, subscription_tier, selected_plan')
        .eq('email', 'newamazonbaap@gmail.com')
        .single();

    if (error) {
        console.error('Error fetching user:', error.message);
    } else {
        console.log('User Profile:', JSON.stringify(data, null, 2));
    }
}

checkUser();
