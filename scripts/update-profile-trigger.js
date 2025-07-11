const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateProfileTrigger() {
  console.log('🔄 Updating profile trigger...')

  try {
    // Read the SQL script
    const fs = require('fs')
    const sqlScript = fs.readFileSync('./database/fix-profile-trigger.sql', 'utf8')

    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlScript
    })

    if (error) {
      console.error('❌ Error executing SQL:', error)
      return
    }

    console.log('✅ Profile trigger updated successfully!')
    
    // Check current profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .limit(10)

    if (!profileError) {
      console.log('\n📊 Sample profiles after update:')
      profiles.forEach(profile => {
        console.log(`  - User ${profile.user_id}: ${profile.full_name || 'No name'}`)
      })
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

// Run the update
updateProfileTrigger()