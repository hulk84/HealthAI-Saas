import { NextResponse } from 'next/server'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  // Test 1: Direct REST API call with hardcoded values
  try {
    const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE'
      }
    })

    results.tests.push({
      name: 'REST API with hardcoded key',
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })
  } catch (error: any) {
    results.tests.push({
      name: 'REST API with hardcoded key',
      error: error.message
    })
  }

  // Test 2: Auth endpoint with hardcoded values
  try {
    const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      })
    })

    const data = await response.json()
    
    results.tests.push({
      name: 'Auth signup with hardcoded key',
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: data
    })
  } catch (error: any) {
    results.tests.push({
      name: 'Auth signup with hardcoded key',
      error: error.message
    })
  }

  // Test 3: Check if project is accessible
  try {
    const response = await fetch('https://fulxozhozkeovsdvwjbl.supabase.co/auth/v1/health')
    
    results.tests.push({
      name: 'Project health check (no auth)',
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })
  } catch (error: any) {
    results.tests.push({
      name: 'Project health check (no auth)',
      error: error.message
    })
  }

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}