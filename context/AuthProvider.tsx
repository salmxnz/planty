import { createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

type AuthContextType = {
  session: Session | null
  isLoading: boolean
  username: string
  website: string
  avatarUrl: string
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  username: '',
  website: '',
  avatarUrl: '',
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  async function getProfile(currentSession?: Session | null) {
    try {
      setIsLoading(true)
      const userSession = currentSession || session
      console.log("Getting profile for user:", userSession?.user?.id)

      if (!userSession?.user?.id) {
        console.log("No user ID available")
        return
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', userSession.user.id)
        .single()

      console.log("Profile data:", data)
      console.log("Profile error:", error)
      console.log("Profile status:", status)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        console.log("Username set to:", data.username)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Profile error:", error.message)
        Alert.alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("Auth effect running")
    
    // Clear any stale data when the effect runs
    setUsername('')
    setWebsite('')
    setAvatarUrl('')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Got initial session:", initialSession?.user?.id)
      if (initialSession?.user) {
        setSession(initialSession)
        getProfile(initialSession)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state changed to:", newSession?.user?.id)
      
      // Clear data if logged out
      if (!newSession) {
        setUsername('')
        setWebsite('')
        setAvatarUrl('')
      }
      
      setSession(newSession)
      if (newSession?.user) {
        getProfile(newSession)
      }
    })

    return () => {
      console.log("Cleaning up auth effect")
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      session, 
      isLoading, 
      username, 
      website, 
      avatarUrl,
      refreshProfile: () => getProfile()
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
