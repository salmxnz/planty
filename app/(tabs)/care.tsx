import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import PlantCardCare from '@/components/PlantCardCare'
import PlantStatsDashboard from '@/components/PlantStatsDashboard'
import { useUserPlants, Plant } from '@/context/UserPlantsProvider'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'

const Care = () => {
    const { plants, addPlant } = useUserPlants();
    const [userPlants, setUserPlants] = useState<Plant[]>([]);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    useEffect(() => {
        // Get the first 2 plants for the preview
        setUserPlants(plants.slice(0, 2));
    }, [plants]);
    
    const navigateToAddPlant = () => {
        router.push('/screens/add-plant');
    };
    
    const navigateToMyPlants = () => {
        router.push('/screens/my-plants');
    };
    
  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark" edges={['bottom', 'top']}>
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
              <View className="flex-row items-center ">
              <TouchableOpacity 
                className="font-psemibold text-primary-dark mt-6 dark:text-primary-light mr-2 p-1 bg-primary-dark dark:bg-primary-light rounded-full"
                onPress={navigateToAddPlant}
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center mr-6 mt-6 border border-primary-dark dark:border-primary-light rounded-full px-2 py-1"
                onPress={navigateToMyPlants}
              >
                <Text className="text-sm font-pregular text-primary-dark dark:text-primary-light mr-1">View all</Text>
                <Ionicons name="chevron-forward" size={15} color="black" />
              </TouchableOpacity>
              </View>
            </View>
            
            {userPlants.length > 0 ? (
              <View className="flex-row items-center gap-4 mx-auto mt-2 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)] w-auto">
                {userPlants.map((plant) => (
                  <PlantCardCare key={plant.id} product={plant} />
                ))}
              </View>
            ) : (
              <View className="mx-6 mt-2 bg-primary-light dark:bg-black-100 rounded-xl p-6 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                <View className="items-center">
                  <Ionicons name="leaf-outline" size={48} color={isDark ? '#9FF16D' : '#568030'} />
                  <Text className="text-center text-primary-dark dark:text-primary-light font-pmedium mt-4 mb-2">
                    You don't have any plants yet
                  </Text>
                  <Text className="text-center text-gray-500 mb-6">
                    Add plants to your collection to track their care and health
                  </Text>
                  <TouchableOpacity 
                    className="bg-accent-light dark:bg-accent-dark px-6 py-3 rounded-full"
                    onPress={navigateToAddPlant}
                  >
                    <Text className="text-white dark:text-black font-pmedium">
                      Add Your First Plant
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
              {/* Plant Statistics Dashboard */}
              <View className="px-4 mt-2">
                <PlantStatsDashboard />
              </View>
        </ScrollView>
      </GestureHandlerRootView> 
    </SafeAreaView>
  )
}

export default Care