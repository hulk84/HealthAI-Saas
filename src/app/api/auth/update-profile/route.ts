import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user_id, full_name } = await request.json()

    if (!user_id || !full_name) {
      return NextResponse.json(
        { error: 'user_id y full_name son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking profile:', checkError)
      return NextResponse.json(
        { error: 'Error al verificar perfil' },
        { status: 500 }
      )
    }

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name })
        .eq('user_id', user_id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return NextResponse.json(
          { error: 'Error al actualizar perfil' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        message: 'Perfil actualizado exitosamente',
        updated: true 
      })
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id,
          full_name
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return NextResponse.json(
          { error: 'Error al crear perfil' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        message: 'Perfil creado exitosamente',
        created: true 
      })
    }

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}