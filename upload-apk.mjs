import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAPK() {
    try {
        console.log('📦 Reading APK file...');
        const apkPath = 'C:\\Users\\Planet pc\\Downloads\\italostudy-v1.0.0-release.apk';
        const fileBuffer = readFileSync(apkPath);

        console.log('📤 Uploading to Supabase storage...');
        const fileName = 'italostudy-v1.0.0-release.apk';

        // Upload to storage bucket 'apk-files'
        const { data, error } = await supabase.storage
            .from('apk-files')
            .upload(fileName, fileBuffer, {
                contentType: 'application/vnd.android.package-archive',
                upsert: true
            });

        if (error) {
            console.error('❌ Upload error:', error);
            process.exit(1);
        }

        console.log('✅ Upload successful!');

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('apk-files')
            .getPublicUrl(fileName);

        console.log('\n🔗 Public Download Link:');
        console.log(urlData.publicUrl);
        console.log('\nYou can now share this link for APK downloads!');

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

uploadAPK();
