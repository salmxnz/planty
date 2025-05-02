import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import PlantCardCare from '@/components/PlantCardCare'
import { useUserPlants, Plant } from '@/context/UserPlantsProvider'
import { useColorScheme } from 'nativewind'

export default function MyPlants() {
  const { plants, removePlant } = useUserPlants()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [isEditing, setIsEditing] = useState(false)

  const renderPlantItem = ({ item }: { item: Plant }) => (
    <View className="mb-4 mx-2 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
      <PlantCardCare product={item} />
      {isEditing && (
        <TouchableOpacity 
          className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
          onPress={() => removePlant(item.id)}
        >
          <Ionicons name="close" size={16} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark">
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light">
          My Plants
        </Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={24} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
      </View>

      {plants.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons 
            name="leaf-outline" 
            size={64} 
            color={isDark ? '#9FF16D' : '#568030'} 
          />
          <Text className="text-center text-lg font-pmedium text-primary-dark dark:text-primary-light mt-4">
            You don't have any plants yet
          </Text>
          <Text className="text-center text-sm text-gray-500 mt-2 mb-6">
            Add plants to your collection to track their care and health
          </Text>
          <TouchableOpacity 
            className="bg-accent-light dark:bg-accent-dark px-6 py-3 rounded-full"
            onPress={() => router.push('/screens/add-plant')}
          >
            <Text className="text-white dark:text-black font-pmedium">
              Add Your First Plant
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plants}
          renderItem={renderPlantItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}
