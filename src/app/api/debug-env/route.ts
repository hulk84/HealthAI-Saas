import { NextResponse } from 'next/server'

export async function GET() {
  // This endpoint helps debug environment variables
  const envVars = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Show partial values for security
    urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) + '...' || 'NOT SET',
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) + '...' || 'NOT SET',
    
    // Check key types
    serviceKeyType: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') ? 'JWT' : 
                   process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('sbp_') ? 'Access Token' : 
                   'Unknown or Not Set',
    
    // Node environment
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  }

  return NextResponse.json(envVars, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}