import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Usar service role key temporalmente para diagnóstico
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar si el usuario existe
    const { data: { users }, error: findError } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = users?.find(u => u.email === email)

    if (!userExists) {
      return NextResponse.json({
        error: 'Usuario no encontrado'
      }, { status: 404 })
    }

    // Intentar login con anon key
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Si falla con anon key, intentar otra estrategia
      return NextResponse.json({
        error: error.message,
        userExists: true,
        suggestion: 'Intenta resetear tu contraseña'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user
    })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}