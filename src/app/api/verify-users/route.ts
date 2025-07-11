import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Usar service role key para ver todos los usuarios
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener usuarios de auth.users
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    // Obtener perfiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')

    return NextResponse.json({
      authUsers: users?.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        email_confirmed_at: u.email_confirmed_at,
        last_sign_in_at: u.last_sign_in_at
      })),
      profiles: profiles,
      errors: {
        auth: authError?.message,
        profile: profileError?.message
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}