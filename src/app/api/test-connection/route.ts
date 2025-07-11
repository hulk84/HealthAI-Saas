import { NextResponse } from 'next/server'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    tests: [] as Array<{
      name: string
      success: boolean
      status?: number
      statusText?: string
      error?: string
    }>
  }

  // Test 1: Basic connection to Supabase
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      results.tests.push({
        name: 'Environment Check',
        success: false,
        error: 'Missing environment variables'
      })
      return NextResponse.json(results)
    }

    // Test REST API
    const restResponse = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    })

    results.tests.push({
      name: 'REST API Connection',
      success: restResponse.ok,
      status: restResponse.status,
      statusText: restResponse.statusText
    })

    // Test if we can access the profiles table
    const profilesResponse = await fetch(`${url}/rest/v1/profiles?select=count`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'count=exact'
      }
    })

    results.tests.push({
      name: 'Profiles Table Access',
      success: profilesResponse.ok,
      status: profilesResponse.status,
      statusText: profilesResponse.statusText
    })

  } catch (error: any) {
    results.tests.push({
      name: 'Connection Test',
      success: false,
      error: error.message
    })
  }

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}