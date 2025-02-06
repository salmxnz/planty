import { View, Text } from 'react-native'
import React from 'react'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native'

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark" edges={['bottom']}>
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="flex-1 p-3 mt-2 mx-3">
            <View className="flex-row flex-wrap gap-3 justify-between shadow-[0px_20px_25px_10px_rgba(0,0,0,0.15)] dark:shadow-[0px_20px_25px_10px_rgba(250,250,250,0.15)]">
              <ProductCard />
              <ProductCard/>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView> 
    </SafeAreaView>
  )
}

export default Home