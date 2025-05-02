import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'

const Care = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark" edges={['bottom', 'top']}>
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ height: "100%", paddingBottom: 100 }}>
            <View className="flex flex-row items-center justify-between w-full px-6">
              <View>
                <Text className="text-primary-dark dark:text-white text-3xl font-psemibold">
                    Plant Care{' '}
                </Text>
                <View className="flex flex-row">
                    <Text className="text-accent-light dark:text-accent-dark text-lg font-psemibold">
                        Keep your{' '}
                    </Text>
                    <Text className="text-primary-dark dark:text-primary-light text-lg font-psemibold">
                        plants{' '}
                    </Text>
                    <Text className="text-primary-dark dark:text-primary-light text-lg font-psemibold">
                        healthy {' '}
                    </Text>
                </View>
                <Text className="text-primary-dark dark:text-primary-light text-lg font-psemibold">
                    and in check
                </Text>
            </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light ml-6 mt-6">My Plants</Text>
              <View className="flex-row items-center mr-6 mt-6 border border-primary-dark dark:border-primary-light rounded-full px-2 py-1">
                <Text className="text-sm font-pregular text-primary-dark dark:text-primary-light mr-1">View all</Text>
                <Ionicons name="chevron-forward" size={15} color="black" />
              </View>
            </View>
              <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light ml-6 mt-6">Statistics</Text>
              <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light ml-6 mt-6">Quick Tips</Text>
              {/* <View className="flex-row items-center mr-6 mt-6 border border-primary-dark dark:border-primary-light rounded-full px-2 py-1">
                <Text className="text-sm font-pregular text-primary-dark dark:text-primary-light mr-1">View all</Text>
                <Ionicons name="chevron-forward" size={15} color="black" />
              </View> */}
        </ScrollView>
      </GestureHandlerRootView> 
    </SafeAreaView>
  )
}

export default Care