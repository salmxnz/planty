import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useColorScheme } from '@/hooks/useColorScheme'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ProductCard from '@/components/ProductCard'

const Explore = () => {
    const colorScheme = useColorScheme()
    const feature = {
        name: "Explore",
    }
  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark" edges={['bottom']}>
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="flex-1">
            <View className="pt-20" />
            <View className="flex flex-row items-center justify-between w-full px-6">
                            <View>
                                <Text className="text-primary-dark dark:text-white text-3xl font-psemibold">
                                    Explore our {' '}
                                </Text>
                                <View className="flex flex-row">
                                    <Text className="text-accent-light dark:text-accent-dark text-3xl font-psemibold">
                                    curated{' '}
                                    </Text>
                                    <Text className="text-primary-dark dark:text-primary-light text-3xl font-psemibold">
                                    selection of{' '}
                                    </Text>
                                </View>
                                <Text className="text-primary-dark dark:text-primary-light text-3xl font-psemibold">
                                        plants
                                    </Text>
                            </View>
            </View>
            {/* <Text className="text-lg mt-3 ml-6 font-pmedium text-primary-dark dark:text-primary-light mb-1">
                These are some of our Explore
            </Text> */}
            <View className="mt-4 h-[80vh] w-full px-6 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                <View className="flex flex-row items-start gap-5 justify-between flex-wrap">
                </View>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView> 
    </SafeAreaView>
  )
}

export default Explore