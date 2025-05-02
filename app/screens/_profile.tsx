import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { StyleSheet, View, Alert, TouchableOpacity, Text, ScrollView, Image, useColorScheme } from 'react-native'
import { Button, Input } from '@rneui/themed'
import Avatar from '@/components/Avatar'
import { useAuth } from '@/context/AuthProvider'
import { router } from 'expo-router'
import PlantCardSmall from '@/components/PlantCardSmall'
import { Ionicons } from '@expo/vector-icons'

// Define the Plant interface to match the PlantCardSmall component requirements
interface Plant {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  user_id: string;
}

export default function Profile() {
  const { session, username: contextUsername, website: contextWebsite, avatarUrl: contextAvatarUrl, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userListings, setUserListings] = useState<Plant[]>([])
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  
  const [formData, setFormData] = useState({
    username: '',
    website: '',
    avatarUrl: ''
  })
  
  // Mock data for followers/following
  const [stats] = useState({
    following: 6,
    followers: 13,
    likes: 3
  })

  // Initialize form data with context values
  useEffect(() => {
    setFormData({
      username: contextUsername || '',
      website: contextWebsite || '',
      avatarUrl: contextAvatarUrl || ''
    })
    
    // fetchUserListings()
  }, [contextUsername, contextWebsite, contextAvatarUrl])

  async function fetchUserListings() {
    try {
      setLoading(true)
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      
      // Cast the data to the Plant type
      setUserListings(data as Plant[] || [])
    } catch (error) {
      console.error('Error fetching user listings:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <ScrollView className="flex-1 bg-primary-light dark:bg-black-100" showsHorizontalScrollIndicator={false}>
      <View className="pt-12 px-4">
        {/* Back button */}
        <TouchableOpacity 
          className="mb-2" 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        
        {/* Profile header */}
        <View className="items-center mb-6">
          <View className="relative">
            <Avatar
              size={120}
              url={formData.avatarUrl}
              onUpload={(url: string) => {
                setFormData(prev => ({ ...prev, avatarUrl: url }))
              }}
            />
            {/* Improved plus icon implementation */}
            {/* <TouchableOpacity 
              className="absolute bottom-1 right-1 bg-accent-light dark:bg-accent-dark rounded-full w-8 h-8 items-center justify-center"
              onPress={() => {
                // This will trigger the Avatar's upload functionality
                // The Avatar component should already have this functionality
              }}
            >
              <Ionicons name="add" size={18} color="#ffffff" />
            </TouchableOpacity> */}
          </View>
          
          <Text className="text-lg font-psemibold text-black dark:text-white mt-2">
            @{formData.username || 'username'}
          </Text>
        </View>
        
        {/* Stats section */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center flex-1">
            <Text className="text-2xl font-pbold text-black dark:text-white">{stats.following}</Text>
            <Text className="text-sm text-gray-500">Purchases</Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-2xl font-pbold text-black dark:text-white">{stats.followers}</Text>
            <Text className="text-sm text-gray-500">Listings</Text>
          </View>
          
          <View className="items-center flex-1">
            <Text className="text-2xl font-pbold text-black dark:text-white">{stats.likes}</Text>
            <Text className="text-sm text-gray-500">Plants</Text>
          </View>
        </View>
        
        {/* Bio section */}
        {/* <View className="mb-2">
          <Text className="text-sm text-black dark:text-white mb-1">
            {formData.website && (
              <Text className="text-accent-light dark:text-accent-dark">{formData.website}</Text>
            )}
          </Text>
        </View> */}
        
        {/* Edit profile form */}
        <View className="mb-6 bg-gray-50 dark:bg-black-200 w-auto p-5 mx-2 rounded-lg">
          <Text className="text-lg font-psemibold text-black dark:text-white mb-4">
            Profile Details
          </Text>
          
          <View className="">
            <Text className="text-sm font-pmedium text-gray-500 mb-1">Email</Text>
            <Input 
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={{borderBottomWidth: 0, backgroundColor: isDark ? '#1E1E2D' : '#ffffff', borderRadius: 8, paddingHorizontal: 12}}
              inputStyle={{fontSize: 14, color: isDark ? '#ffffff' : '#000000'}}
              value={session?.user?.email} 
              disabled
            />
          </View>
          
          <View className="">
            <Text className="text-sm font-pmedium text-gray-500 mb-1">Username</Text>
            <Input 
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={{borderBottomWidth: 0, backgroundColor: isDark ? '#1E1E2D' : '#ffffff', borderRadius: 8, paddingHorizontal: 12}}
              inputStyle={{fontSize: 14, color: isDark ? '#ffffff' : '#000000'}}
              value={formData.username} 
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
            />
          </View>
          
          {/* <View className="mb-4">
            <Text className="text-sm font-pmedium text-gray-500 mb-1">Website</Text>
            <Input 
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={{borderBottomWidth: 0, backgroundColor: isDark ? '#1E1E2D' : '#f5f5f5', borderRadius: 8, paddingHorizontal: 12}}
              inputStyle={{fontSize: 14, color: isDark ? '#ffffff' : '#000000'}}
              value={formData.website} 
              onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
            />
          </View> */}
          
          <Button 
            title="Update Profile"
            onPress={updateProfile}
            loading={loading}
            buttonStyle={{
              backgroundColor: isDark ? '#9FF16D' : '#568030',
              borderRadius: 8,
              paddingVertical: 12
            }}
            titleStyle={{
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
              color: isDark ? '#000000' : '#ffffff'
            }}
          />
        </View>
        
        {/* My Listings section */}
        <View className="mb-6">
          <Text className="text-2xl ml-6 font-psemibold text-black dark:text-white mb-4">
            My Listings
          </Text>
          
          {userListings.length === 0 ? (
            <View className="items-center mx-2 py-8 bg-gray-50 dark:bg-black-200 rounded-xl">
              <Ionicons name="leaf-outline" size={48} color={isDark ? '#9FF16D' : '#568030'} />
              <Text className="text-center text-black dark:text-white mt-4">
                You don't have any plant listings yet.
              </Text>
              <TouchableOpacity 
                className="mt-4 bg-accent-light dark:bg-accent-dark px-6 py-3 rounded-full"
                onPress={() => {
                  // Navigate to add plant screen - using a relative path to avoid TypeScript error
                  router.push('/screens/_sell' as any)
                }}
              >
                <Text className="text-white dark:text-black font-pmedium">Add a Plant</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {userListings.map((plant) => (
                <View key={plant.id} className="mb-4">
                  <PlantCardSmall product={plant} />
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Sign out button */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          loading={loading}
          buttonStyle={{
            backgroundColor: '#dc2626',
            borderRadius: 8,
            marginBottom: 30,
            paddingVertical: 12,
            marginHorizontal: 8
          }}
          titleStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 16
          }}
        />
      </View>
    </ScrollView>
  )
}