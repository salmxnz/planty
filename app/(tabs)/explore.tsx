import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    GestureHandlerRootView,
    ScrollView,
} from 'react-native-gesture-handler'
import { useColorScheme } from '@/hooks/useColorScheme'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ProductCard from '@/components/ProductCard'
import SearchBarMaximize from '@/components/SearchBarMaximize'
import { useState, useEffect } from 'react'
import { PlantFetchByTrait } from '@/api/supabaseFunctions'
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

const Explore = () => {
    const [productLoading, setProductLoading] = useState<boolean>(true)
    const colorScheme = useColorScheme()
    const feature = {
        name: 'Explore',
    }
    const [searchTerm, setSearchTerm] = useState('')
    const handleChangeText = (text: string) => {
        setSearchTerm(text)
    }

    const [lowLightPlants, setLowLightPlants] = useState<Plant[]>([])

    useEffect(() => {
        const fetchLowLightPlants = async () => {
            const lowLightPlants = await PlantFetchByTrait(
                'light_requirements',
                'low',
            )
            setLowLightPlants(lowLightPlants as Plant[])
            setProductLoading(false)
        }
        fetchLowLightPlants()
    }, [])

    const [easyCarePlants, setEasyCarePlants] = useState<Plant[]>([])

    useEffect(() => {
        const fetchEasyCarePlants = async () => {
            const easyCarePlants = await PlantFetchByTrait(
                'care_level',
                'easy',
            )
            setEasyCarePlants(easyCarePlants as Plant[])
            setProductLoading(false)
          }
        fetchEasyCarePlants()
    }, [])

    const [petFriendlyPlants, setPetFriendlyPlants] = useState<Plant[]>([])

    useEffect(() => {
        const fetchPetFriendlyPlants = async () => {
            const petFriendlyPlants = await PlantFetchByTrait(
                'pet_friendly',
                'TRUE',
            )
            setPetFriendlyPlants(petFriendlyPlants as Plant[])
            setProductLoading(false)
          }
        fetchPetFriendlyPlants()
    }, [])

    return (
        <SafeAreaView
            className="flex-1 bg-primary-light dark:bg-primary-dark"
            edges={['bottom']}
        >
            <GestureHandlerRootView className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="flex-1">
                        <View className="pt-20" />

                        <View className="flex flex-row items-center justify-between w-full px-6">
                            <View>
                                <Text className="text-primary-dark dark:text-white text-3xl font-psemibold">
                                    Explore our{' '}
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
                            <View>
                                <TouchableOpacity className="p-4 rounded-full bg-primary-dark dark:bg-primary-light">
                                    <Ionicons
                                        name="bag-handle-outline"
                                        size={20}
                                        color={
                                            colorScheme === 'dark'
                                                ? '#3e3e3e'
                                                : '#ffffff'
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="px-6 mt-6">
                            <SearchBarMaximize
                                value={searchTerm}
                                handleChangeText={handleChangeText}
                            />
                        </View>
                        <View className="px-6 mt-8 flex-row items-center gap-3">
                            <Ionicons
                                name="paw-outline"
                                size={26}
                                color={
                                    colorScheme === 'dark'
                                        ? '#ffffff'
                                        : '#000000'
                                }
                            />
                            <Text className="text-2xl font-psemibold text-primary-dark dark:text-primary-light">
                                Pet Friendly Plants
                            </Text>
                        </View>
                        <View className="ml-6 mt-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 23 }}
                            className="flex-row"
                        >
                            {productLoading ? (
                                <>
                                <SkeletonPlant />
                                <SkeletonPlant />
                                </>
                            ) : (
                                petFriendlyPlants.map((plant: Plant) => (
                                    <ProductCard
                                        key={plant.id}
                                        product={plant}
                                    />
                                ))
                            )}
                        </ScrollView>
                        </View>
                        {/* <View className="px-6 mt-8 flex-row items-center gap-3">
                            <Ionicons
                                name="star-outline"
                                size={26}
                                color={
                                    colorScheme === 'dark'
                                        ? '#ffffff'
                                        : '#000000'
                                }
                            />
                            <Text className="text-2xl font-psemibold text-primary-dark dark:text-primary-light">
                                Popular Plants
                            </Text>
                        </View> */}

                        <View className="px-6 mt-8 flex-row items-center gap-3">
                            <Ionicons
                                name="moon-outline"
                                size={26}
                                color={
                                    colorScheme === 'dark'
                                        ? '#ffffff'
                                        : '#000000'
                                }
                            />
                            <Text className="text-2xl font-psemibold text-primary-dark dark:text-primary-light">
                                Low Light Plants
                            </Text>
                        </View>
                        <View className="ml-6 mt-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 23 }}
                            className="flex-row"
                        >
                            {productLoading ? (
                                <>
                                <SkeletonPlant />
                                <SkeletonPlant />
                                </>
                            ) : (
                                lowLightPlants.map((plant: Plant) => (
                                    <ProductCard
                                        key={plant.id}
                                        product={plant}
                                    />
                                ))
                            )}
                        </ScrollView>
                        </View>

                        <View className="px-6 mt-8 flex-row items-center gap-3">
                            <Ionicons
                                name="water-outline"
                                size={26}
                                color={
                                    colorScheme === 'dark'
                                        ? '#ffffff'
                                        : '#000000'
                                }
                            />
                            <Text className="text-2xl font-psemibold text-primary-dark dark:text-primary-light">
                                Easy Care Plants
                            </Text>
                        </View>
                        <View className="ml-6 mt-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 23 }}
                            className="flex-row"
                        >
                            {productLoading ? (
                                <>
                                <SkeletonPlant />
                                <SkeletonPlant />
                                </>
                            ) : (
                                easyCarePlants.map((plant: Plant) => (
                                    <ProductCard
                                        key={plant.id}
                                        product={plant}
                                    />
                                ))
                            )}
                        </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Explore
