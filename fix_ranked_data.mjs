import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  const testId = 'a130c253-95b8-485b-a613-8562bf9c1196'; // From user error logs
  console.log('Fixing data for testId:', testId);

  const { data: test } = await supabase.from('tests').select('session_id').eq('id', testId).single();
  
  if (test?.session_id) {
    console.log('Session ID:', test.session_id);
    const { count, error } = await supabase
      .from('tests')
      .update({ is_ranked: true })
      .eq('session_id', test.session_id)
      .eq('status', 'completed');
      
    if (error) console.error('Update error:', error);
    else console.log('Updated tests to is_ranked=true. Count:', count);
  } else {
    console.log('No session_id found for this test.');
  }
}

fix();
