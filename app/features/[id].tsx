import { Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Ionicons } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import {
    FeaturesFetchById,
    PlantByFeaturesFetch,
} from '@/api/supabaseFunctions'
import PlantCardSmall from '@/components/PlantCardSmall'
import Loading from '@/components/Loading'
import SkeletonPlant from '@/components/SkeletonPlant'

interface Feature {
    id: number
    name: string
    img_url: string
}

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

const FeatureDetails = () => {
    const colorScheme = useColorScheme()
    const { id } = useLocalSearchParams<{ id: string }>()
    const [feature, setFeature] = useState<Feature | null>(null)
    const [loading, setLoading] = useState(true)
    const [plants, setPlants] = useState<Plant[] | null>(null)

    //fetch feature by id
    useEffect(() => {
        const fetchFeature = async () => {
            const feature =
                (await FeaturesFetchById(id as unknown as number)) || []
            setFeature(feature[0] as Feature)
            setLoading(false)
        }
        fetchFeature()
    }, [])

    //fetch plants by feature id
    useEffect(() => {
        const fetchPlants = async () => {
            const plants = await PlantByFeaturesFetch(id as unknown as number)
            setPlants(plants as Plant[])
            console.log(plants)
            setLoading(false)
        }
        fetchPlants()
    }, [])

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
                {/* <View className=" ml-7 mt-7 flex-1">
                    <SkeletonPlant />
                </View> */}
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
                            {feature?.name}
                        </Text>
                    </View>
                    <Text className="text-lg mt-3 ml-5 font-pmedium text-primary-dark dark:text-primary-light mb-1">
                        These are some of our {feature?.name}
                    </Text>
                    {/* <Text className="text-2xl font-bold">Feature Details {id}</Text>
                    <Text className="text-2xl font-bold">Plants {plants?.length}</Text> */}
                    <View className="mt-4 h-[80vh] w-full px-6 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                        <View className="flex flex-row items-start gap-5 justify-between flex-wrap">
                            {plants?.map((plant, index) => (
                                <PlantCardSmall key={index} product={plant} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default FeatureDetails
