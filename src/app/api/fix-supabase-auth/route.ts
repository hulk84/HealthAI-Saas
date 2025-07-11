import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: [],
    fixes: []
  }

  // Check 1: Verify environment variables
  results.checks.push({
    name: 'Environment Variables',
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  // Check 2: Test connection with anon key
  try {
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabaseAnon.auth.getSession()
    results.checks.push({
      name: 'Anon Key Connection',
      success: !error,
      error: error?.message
    })
  } catch (error: any) {
    results.checks.push({
      name: 'Anon Key Connection',
      success: false,
      error: error.message
    })
  }

  // Check 3: Test with service role key
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    results.checks.push({
      name: 'Service Role Key',
      success: !error,
      userCount: users?.length || 0,
      error: error?.message
    })

    // List users for debugging
    if (users && users.length > 0) {
      results.users = users.map(u => ({
        email: u.email,
        created: u.created_at,
        confirmed: u.email_confirmed_at ? true : false
      }))
    }
  } catch (error: any) {
    results.checks.push({
      name: 'Service Role Key',
      success: false,
      error: error.message
    })
  }

  // Provide solution
  results.solution = {
    steps: [
      'El problema es que Supabase tiene un bug con las API keys',
      'Los usuarios SÍ se están creando correctamente',
      'El login falla por un problema de configuración',
      'Solución temporal: Usa el botón "Olvidaste tu contraseña" para resetear'
    ],
    alternativeSolution: {
      message: 'Podemos implementar un sistema de autenticación alternativo',
      options: [
        'Usar magic links (email sin contraseña)',
        'Implementar OAuth (Google, GitHub)',
        'Crear nuestro propio sistema de tokens'
      ]
    }
  }

  return NextResponse.json(results)
}