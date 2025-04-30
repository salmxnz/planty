import React, { useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Loading from '@/components/Loading'
import { PlantDetailsFetch } from '@/api/supabaseFunctions'
import { useColorScheme } from '@/hooks/useColorScheme'


interface Plant {
    id: string
    name: string
    slug: string
    image_url: string
    description?: string
    price?: string
    care_level?: string
    light_requirements?: string
    water_frequency?: string
    stock_quantity?: number
}

const fetchPlantbySlug = async (slug: string) => {
    const {plant} = await PlantDetailsFetch(slug)
    return plant
}

export default function PlantDetails() {
    const colorScheme = useColorScheme()
    const { slug } = useLocalSearchParams<{ slug: string }>()
    const [plant, setPlant] = useState<Plant | null>(null)
    const [loading, setLoading] = useState(true)
    const [imageLoading, setImageLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    

    useEffect(() => {
        // In a real app, you would fetch the plant data from your API here
        // For now, we'll simulate a fetch with setTimeout
        setLoading(true)
        setImageLoading(true) // Reset image loading state when fetching new plant

        // Fetch plant data from Supabase
        const loadPlant = async () => {
            try {
                const plantData = await fetchPlantbySlug(slug as string)
                if (plantData && plantData.length > 0) {
                    setPlant(plantData[0])
                } else {
                    // Fallback data if plant not found in database
                    setPlant({
                        id: '123',
                        name: 'Monstera Deliciosa',
                        slug: slug as string,
                        image_url:
                            'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3',
                        description:
                            'The Monstera deliciosa plant, also known as the Swiss cheese plant, is a species of flowering plant native to tropical forests of southern Mexico.',
                        price: '$35.99',
                        care_level: 'Easy',
                        light_requirements: 'Medium to bright indirect light',
                        water_frequency: 'Once a week',
                    })
                }
            } catch (error) {
                console.error('Error fetching plant:', error)
                // Fallback data in case of error
                setPlant({
                    id: '123',
                    name: 'Monstera Deliciosa',
                    slug: slug as string,
                    image_url:
                        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3',
                    description:
                        'The Monstera deliciosa plant, also known as the Swiss cheese plant, is a species of flowering plant native to tropical forests of southern Mexico.',
                    price: '$35.99',
                    care_level: 'Easy',
                    light_requirements: 'Medium to bright indirect light',
                    water_frequency: 'Once a week',
                })
            } finally {
                setLoading(false)
            }
        }

        loadPlant()
    }, [slug])

    if (loading) {
      return (
        <Loading/>
      )
    }

    if (!plant) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-[#121214]">
                <Text className="text-primary-dark dark:text-primary-light">
                    Plant not found
                </Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white dark:bg-[#121214]">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="pt-20" />

            <View className="px-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="ml-2"
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#CDCDE0' : '#3E3E3E'} />
                </TouchableOpacity>
                <Text className="text-2xl ml-5 font-pbold text-primary-dark dark:text-primary-light mb-1">
                    {plant.name}
                </Text>
            </View>

            <View className="p-4 flex-1">
                <View className="items-center mb-6 rounded-lg">
                    {imageLoading && (
                        <View className="w-full h-[300px] rounded-[24px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                    {plant?.image_url && (
                        <Image
                            source={{ uri: plant.image_url }}
                            className={`w-full h-[300px] rounded-[24px] ${imageLoading ? 'absolute opacity-0' : ''}`}
                            resizeMode="cover"
                            onLoadStart={() => setImageLoading(true)}
                            onLoadEnd={() => setImageLoading(false)}
                        />
                    )}
                </View>
                <View className="mb-4">
                    <Text className="text-2xl font-pbold text-primary-dark dark:text-primary-light mb-1">
                        {plant.name}
                    </Text>
                    <Text className="text-xl font-psemibold text-accent-light dark:text-accent-dark mb-4">
                        Rs {plant.price}
                    </Text>
                    <Text className="text-base font-pregular text-primary-dark dark:text-primary-light mb-4">
                        {plant.description}
                    </Text>
                </View>
                <View className="bg-gray-200 dark:bg-[#1b1b1d] p-4 rounded-lg mb-4">
                    <Text className="text-lg font-pmedium text-primary-dark dark:text-primary-light mb-2">
                        Plant Care
                    </Text>

                    <View className="flex-row mb-2">
                        <Text className="font-pmedium text-primary-dark dark:text-primary-light mr-2">
                            Care Level:
                        </Text>
                        <Text className="font-pregular text-primary-dark dark:text-primary-light">
                            {plant.care_level}
                        </Text>
                    </View>
                    <View className="flex-row mb-2">
                        <Text className="font-pmedium text-primary-dark dark:text-primary-light mr-2">
                            Light:
                        </Text>
                        <Text className="font-pregular text-primary-dark dark:text-primary-light">
                            {plant.light_requirements}
                        </Text>
                    </View>
                    <View className="flex-row">
                        <Text className="font-pmedium text-primary-dark dark:text-primary-light mr-2">
                            Water:
                        </Text>
                        <Text className="font-pregular text-primary-dark dark:text-primary-light">
                            {plant.water_frequency}
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* Fixed bottom bar */}
            <View className="px-4 py-4 bg-white dark:bg-[#121214] border-gray-200 dark:border-gray-800 flex-row items-center gap-5 pb-16">
                <View className="w-[30vw] h-14 flex-row items-center gap-2 justify-between">
                  <TouchableOpacity 
                    className='rounded-full border-2 border-black dark:border-white w-10 h-10 items-center justify-center'
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Text className="text-black dark:text-white font-pbold text-base">-</Text>
                  </TouchableOpacity>
                  <Text className="text-black dark:text-white font-pmedium text-base">
                        {quantity}
                    </Text>
                  <TouchableOpacity 
                    className='rounded-full border-2 border-black dark:border-white w-10 h-10 items-center justify-center'
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Text className="text-black dark:text-white font-pbold text-base">+</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                <TouchableOpacity
                    className="bg-accent-light dark:bg-accent-dark py-4 rounded-full items-center w-full"
                    onPress={() => {
                        // Add to cart functionality would go here
                        console.log('Add to cart:', plant.name)
                    }}
                >
                    <Text className="text-white dark:text-black font-pmedium text-base">
                        Add to Cart
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
