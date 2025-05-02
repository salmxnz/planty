import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useUserPlants, Plant } from '@/context/UserPlantsProvider'
import { useColorScheme } from 'nativewind'
import { AllPlantsFetch } from '@/api/supabaseFunctions'
import PlantCardAdd from '@/components/PlantCardAdd'
import SearchBar from '@/components/SearchBar'

export default function AddPlant() {
  const { addPlant, userHasPlant } = useUserPlants()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [loading, setLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPlants()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlants(plants)
    } else {
      const filtered = plants.filter(plant => 
        plant.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPlants(filtered)
    }
  }, [searchQuery, plants])

  const fetchPlants = async () => {
    try {
      setLoading(true)
      const allPlants = await AllPlantsFetch()
      setPlants(allPlants || [])
      setFilteredPlants(allPlants || [])
    } catch (error) {
      console.error('Error fetching plants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlant = (plant: Plant) => {
    addPlant(plant)
    // Show feedback
    alert(`${plant.name} added to your plants!`)
  }

  const renderPlantItem = ({ item }: { item: Plant }) => {
    const isAdded = userHasPlant(item.id)
    
    return (
      <View className="m-2 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
        <PlantCardAdd 
          plant={item} 
          isAdded={isAdded} 
          onAddPress={handleAddPlant}
        />
      </View>
    )
  }

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
          Add Plants
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search bar */}
      <View className="px-6 mb-4">
        <SearchBar 
          value={searchQuery} 
          handleChangeText={setSearchQuery} 
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#9FF16D' : '#568030'} />
          <Text className="text-primary-dark dark:text-primary-light mt-4">
            Loading plants...
          </Text>
        </View>
      ) : filteredPlants.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons 
            name="search-outline" 
            size={64} 
            color={isDark ? '#9FF16D' : '#568030'} 
          />
          <Text className="text-center text-lg font-pmedium text-primary-dark dark:text-primary-light mt-4">
            No plants found
          </Text>
          <Text className="text-center text-sm text-gray-500 mt-2">
            Try a different search term
          </Text>
        </View>
      ) : (
        <View className="mx-auto">
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
        </View>
      )}
    </SafeAreaView>
  )
}
