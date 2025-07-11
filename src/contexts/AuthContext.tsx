'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  user_id: string
  full_name: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        // Primero verificar localStorage
        const storedUser = localStorage.getItem('healthai-user')
        
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          // Crear objeto User compatible
          const user: User = {
            id: userData.id,
            email: userData.email || '',
            app_metadata: {},
            user_metadata: { full_name: userData.full_name },
            aud: 'authenticated',
            created_at: userData.created_at || new Date().toISOString()
          } as User
          
          setUser(user)
          await fetchProfile(userData.id)
        } else {
          // Si no hay usuario guardado, intentar con Supabase
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            setUser(session.user)
            await fetchProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('healthai-user')
        setUser(null)
        setProfile(null)
        router.push('/login')
      } else if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('healthai-user')
      
      // Intentar cerrar sesión en Supabase también
      await supabase.auth.signOut()
      
      setUser(null)
      setProfile(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      // Aunque falle Supabase, limpiamos el estado local
      localStorage.removeItem('healthai-user')
      setUser(null)
      setProfile(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}