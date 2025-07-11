import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()

    // Validaciones básicas
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Crear cliente con SERVICE ROLE KEY (como en el test que SÍ funciona)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Crear usuario usando admin (como en el test que funciona)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name
      }
    })

    if (authError) {
      // Verificar si el usuario ya existe
      if (authError.message.includes('already exists')) {
        return NextResponse.json({
          message: 'Este email ya está registrado',
          userExists: true
        })
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Verificar que el profile se creó correctamente
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created: true
      },
      profile: profile
    })

  } catch (error: any) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    )
  }
}