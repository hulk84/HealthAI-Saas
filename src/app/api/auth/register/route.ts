import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// This endpoint uses server-side authentication
export async function POST(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      })
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta. Por favor, contacta al administrador.' },
        { status: 500 }
      )
    }

    const { email, password, full_name } = await request.json()

    // Create a server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role key for admin operations
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      }
    )

    // Create the user using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create profile record
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name,
          role: 'user'
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        // Don't fail if profile creation fails - it might be created by trigger
      }
    }

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: authData.user
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    )
  }
}