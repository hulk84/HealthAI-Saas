import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Verificar nuestra cookie de sesión personalizada
  const sessionCookie = request.cookies.get('healthai-session')
  let isAuthenticated = false

  if (sessionCookie) {
    try {
      // Decodificar y verificar la sesión
      const sessionData = JSON.parse(atob(sessionCookie.value))
      // Verificar que la sesión no haya expirado (7 días)
      const createdAt = new Date(sessionData.createdAt)
      const now = new Date()
      const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 7 && sessionData.userId) {
        isAuthenticated = true
      }
    } catch (error) {
      console.error('Invalid session cookie:', error)
    }
  }

  // Si no hay sesión personalizada, intentar con Supabase
  if (!isAuthenticated) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        isAuthenticated = true
      }
    } catch (error) {
      console.error('Error checking Supabase auth:', error)
    }
  }

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/onboarding', '/chat', '/plans']
  const authRoutes = ['/login', '/register']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Si intenta acceder a una ruta protegida sin estar autenticado
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si intenta acceder a login/registro estando autenticado
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}