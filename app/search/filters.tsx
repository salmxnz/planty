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

interface Filters {
  term?: string
  category?: string
  size?: string
  careLevel?: string
  price?: string
}

const SearchFilters = () => {
  const params = useLocalSearchParams()
  const colorScheme = useColorScheme()
  
  // Extract filter parameters
  const filters: Filters = {
    term: params.term as string,
    category: params.category as string,
    size: params.size as string,
    careLevel: params.careLevel as string,
    price: params.price as string
  }
  
  const [loading, setLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])

  // Get filter description for display
  const getFilterDescription = () => {
    const activeFilters = []
    
    if (filters.category) activeFilters.push(`Category: ${filters.category}`)
    if (filters.size) activeFilters.push(`Size: ${filters.size}`)
    if (filters.careLevel) activeFilters.push(`Care: ${filters.careLevel}`)
    if (filters.price) activeFilters.push(`Max Price: Rs ${filters.price}`)
    
    if (activeFilters.length === 0) return ''
    return activeFilters.join(' • ')
  }

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const allPlants = await AllPlantsFetch()
        if (allPlants) {
          setPlants(allPlants as Plant[])
          
          // Apply all filters
          let filtered = [...allPlants] as Plant[]
          
          // Filter by search term
          if (filters.term) {
            filtered = filtered.filter(plant => 
              plant.name.toLowerCase().includes(filters.term?.toLowerCase() || '') ||
              plant.description.toLowerCase().includes(filters.term?.toLowerCase() || '')
            )
          }
          
          // Filter by category
          if (filters.category) {
            const categoryId = parseInt(filters.category)
            if (!isNaN(categoryId)) {
              filtered = filtered.filter(plant => plant.category_id === categoryId)
            }
          }
          
          // Filter by size
          if (filters.size) {
            switch (filters.size) {
              case 'Small':
                filtered = filtered.filter(plant => plant.price < 1000)
                break
              case 'Medium':
                filtered = filtered.filter(plant => plant.price >= 1000 && plant.price <= 3000)
                break
              case 'Large':
                filtered = filtered.filter(plant => plant.price > 3000)
                break
            }
          }
          
          // Filter by care level
          if (filters.careLevel) {
            filtered = filtered.filter(plant => 
              plant.care_level.toLowerCase().includes(filters.careLevel?.toLowerCase() || '')
            )
          }
          
          // Filter by price
          if (filters.price) {
            const maxPrice = parseInt(filters.price)
            if (!isNaN(maxPrice)) {
              filtered = filtered.filter(plant => plant.price <= maxPrice)
            }
          }
          
          setFilteredPlants(filtered)
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [filters])

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
              {filters.term ? `"${filters.term}"` : 'Search Results'}
            </Text>
          </View>
          
          {getFilterDescription() && (
            <Text className="text-sm mt-1 ml-11 font-pregular text-gray-500 dark:text-gray-400">
              {getFilterDescription()}
            </Text>
          )}
          
          <Text className="text-lg mt-3 ml-5 font-pmedium text-primary-dark dark:text-primary-light mb-1">
            {filteredPlants.length > 0 
              ? `Found ${filteredPlants.length} plants`
              : 'No plants match your filters'
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
                name="filter-outline" 
                size={64} 
                color={colorScheme === 'dark' ? '#555555' : '#DDDDDD'} 
              />
              <Text className="text-lg mt-4 font-pmedium text-gray-500 dark:text-gray-400 text-center">
                Try adjusting your filters to see more plants
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

export default SearchFilters
