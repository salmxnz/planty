import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import ProductCard from '@/components/ProductCard'

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark" edges={['bottom']}>
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="flex-1">
            <ProductCard />
          </View>
        </ScrollView>
      </GestureHandlerRootView> 
    </SafeAreaView>
  )
}

export default Profile