import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()

    // Crear cliente con SERVICE ROLE KEY para tener permisos completos
    const supabase = createClient(
      'https://fulxozhozkeovsdvwjbl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5MzgyNCwiZXhwIjoyMDY3NjY5ODI0fQ.zILH5KhcglEp6xB6IKrOoUw_oFnrVC6ouSb0uXljhS8',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Intentar crear el usuario
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name
      }
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        code: authError.code
      }, { status: 400 })
    }

    // Verificar si el profile se creó
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      },
      profile: profile || 'No profile found',
      profileError: profileError?.message
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}