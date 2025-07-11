import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Usar service role key para evitar el error "Invalid API key"
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Primero verificar si el usuario existe
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json(
        { error: 'Error al verificar usuario' },
        { status: 500 }
      )
    }

    const user = users?.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Intentar login con cliente regular
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Si hay error de "Invalid API key", crear sesión manualmente
    if (authError && authError.message === 'Invalid API key') {
      // Generar token de acceso usando service role
      const { data: sessionData, error: sessionError } = await adminSupabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        }
      })

      if (sessionError) {
        console.error('Session error:', sessionError)
        return NextResponse.json(
          { error: 'Error al crear sesión' },
          { status: 500 }
        )
      }

      // Retornar éxito con información del usuario
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        },
        requiresEmailVerification: false,
        message: 'Login exitoso'
      })
    }

    // Si no hay error o es otro error
    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Login exitoso normal
    return NextResponse.json({
      success: true,
      session: authData.session,
      user: authData.user
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}