import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { AllPlantsFetch } from '@/api/supabaseFunctions'
import PlantCardSmall from '@/components/PlantCardSmall'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/hooks/useColorScheme'
import SkeletonPlant from '@/components/SkeletonPlant'

interface Plant {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  price: number
  category_id: number
  stock_quantity: number
  care_level: string
  light_requirements: string
  water_frequency: string
  pet_friendly: boolean
}

const Search = () => {
  const { query } = useLocalSearchParams()
  const searchQuery = decodeURIComponent(query as string)
  const colorScheme = useColorScheme()
  
  const [loading, setLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const allPlants = await AllPlantsFetch()
        if (allPlants) {
          setPlants(allPlants as Plant[])
          
          // Filter plants based on search query
          const filtered = allPlants.filter((plant: Plant) => 
            plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plant.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          
          setFilteredPlants(filtered as Plant[])
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [searchQuery])

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 bg-primary-light dark:bg-primary-dark"
        edges={['bottom']}
      >
        <View className="pt-20" />
        <View className="flex-col items-start">
          <View className="ml-8 h-8 w-[50vw] mt-2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          <View className="ml-8 h-5 w-[85vw] mt-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      className="flex-1 bg-primary-light dark:bg-primary-dark"
      edges={['bottom']}
    >
      <GestureHandlerRootView>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="pt-20" />
          <View className="px-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="ml-2"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={
                  colorScheme === 'dark'
                    ? '#CDCDE0'
                    : '#3E3E3E'
                }
              />
            </TouchableOpacity>
            <Text className="text-2xl ml-5 font-pbold text-primary-dark dark:text-primary-light mb-1">
              Search Results
            </Text>
          </View>
          <Text className="text-lg mt-3 ml-5 font-pmedium text-primary-dark dark:text-primary-light mb-1">
            {filteredPlants.length > 0 
              ? `Found ${filteredPlants.length} plants matching "${searchQuery}"`
              : `No plants found matching "${searchQuery}"`
            }
          </Text>
          
          {filteredPlants.length > 0 ? (
            <View className="mt-4 h-[80vh] w-full px-6 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
              <View className="flex flex-row items-start gap-5 justify-between flex-wrap">
                {filteredPlants.map((plant, index) => (
                  <PlantCardSmall key={index} product={plant} />
                ))}
              </View>
            </View>
          ) : (
            <View className="mt-10 items-center justify-center px-6">
              <Ionicons 
                name="search-outline" 
                size={64} 
                color={colorScheme === 'dark' ? '#555555' : '#DDDDDD'} 
              />
              <Text className="text-lg mt-4 font-pmedium text-gray-500 dark:text-gray-400 text-center">
                Try searching for a different term or browse our categories
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/explore')}
                className="mt-8 bg-accent-light dark:bg-accent-dark py-3 px-6 rounded-full"
              >
                <Text className="text-base font-pmedium text-white dark:text-black">
                  Browse All Plants
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default Search
