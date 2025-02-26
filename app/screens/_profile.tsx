import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native'
import { Button, Input } from '@rneui/themed'
import Avatar from '@/components/Avatar'
import { useAuth } from '@/context/AuthProvider'
import { router } from 'expo-router'

export default function Profile() {
  const { session, username: contextUsername, website: contextWebsite, avatarUrl: contextAvatarUrl, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    website: '',
    avatarUrl: ''
  })

  // Initialize form data with context values
  useEffect(() => {
    setFormData({
      username: contextUsername || '',
      website: contextWebsite || '',
      avatarUrl: contextAvatarUrl || ''
    })
  }, [contextUsername, contextWebsite, contextAvatarUrl])

  async function updateProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username: formData.username,
        website: formData.website,
        avatar_url: formData.avatarUrl,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }

      // Refresh the profile data in context
      await refreshProfile()
      Alert.alert('Success', 'Profile updated successfully')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error updating profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.replace("/sign-in")
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing out', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View>
        <Avatar
          size={200}
          url={formData.avatarUrl}
          onUpload={(url: string) => {
            setFormData(prev => ({ ...prev, avatarUrl: url }))
          }}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>

      <View style={styles.verticallySpaced}>
        <Input 
          label="Username" 
          value={formData.username} 
          onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Input 
          label="Website" 
          value={formData.website} 
          onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
        />
      </View>

      <View>
        <Button 
          className='mb-4'
          title="Update Profile"
          onPress={updateProfile}
          loading={loading}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          loading={loading}
          buttonStyle={styles.signOutButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#0891b2',
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
  }
})