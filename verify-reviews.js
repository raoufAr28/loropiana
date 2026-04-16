
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('--- STARTING REVIEWS BACKEND VERIFICATION ---');
  
  try {
    // 1. Check Schema
    console.log('1. Checking Schema...');
    const { data: sample, error: schemaError } = await supabase.from('reviews').select('*').limit(1);
    
    // If table doesn't exist, we will try to create one or at least verify the fields we need
    if (schemaError) {
       console.error(`!!! SCHEMA ERROR: ${schemaError.message}`);
       process.exit(1);
    }
    
    const existingColumns = Object.keys(sample[0] || {});
    console.log('   Schema OK. Columns:', existingColumns.join(', '));
    
    // Check if 'status' column exists
    if (!existingColumns.includes('status')) {
        console.error('!!! MISSING status column. Current columns:', existingColumns);
        process.exit(1);
    }

    // 2. Submit Review
    console.log('2. Submitting test review...');
    const botName = 'Verification Bot ' + Math.floor(Math.random() * 1000);
    const testReview = {
        full_name: botName,
        email: 'bot@verification.com',
        rating: 5,
        comment_fr: 'Test automated verification SUCCESS.',
        comment_ar: 'تم التحقق بنجاح.',
        status: 'pending'
    };
    
    const { data: inserted, error: pushError } = await supabase
        .from('reviews')
        .insert(testReview)
        .select()
        .single();
        
    if (pushError) throw pushError;
    console.log(`   Review saved successfully. ID: ${inserted.id}, Status: ${inserted.status}`);

    // 3. Approve Review
    console.log('3. Moderating (Approving) review...');
    const { error: modError } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', inserted.id);
        
    if (modError) throw modError;
    console.log('   Review approved.');

    // 4. Verify Public Fetch
    console.log('4. Verifying public fetch...');
    const { data: approved, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved');
        
    if (fetchError) throw fetchError;
    
    const isVisible = approved.some(r => r.id === inserted.id);
    if (isVisible) {
      console.log('   SUCCESS: The approved review is now visible in the public fetch.');
    } else {
      throw new Error('Public visibility failed. Review not found in approved list.');
    }

    console.log('--- VERIFICATION COMPLETE: SYSTEM IS READY ---');
    console.log(`Proof: Review with name "${botName}" is now LIVE.`);
    
    // Small delay for windows stability
    setTimeout(() => { process.exit(0); }, 1000);
  } catch (err) {
    console.error('!!! VERIFICATION FAILED !!!');
    console.error(err.message);
    setTimeout(() => { process.exit(1); }, 1000);
  }
}

verify();
