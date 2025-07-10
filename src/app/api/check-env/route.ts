import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    urlStart: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20),
    serviceKeyType: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('sbp_') ? 'access_token' : 'unknown'
  })
}