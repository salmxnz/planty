import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SphereButton from './sphere'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { images } from '@/constants/index'

interface Product {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    care_level: string;
}

const PlantCardSmall = ({ product }: { product: Product }) => {
    const [imageLoading, setImageLoading] = useState(true)

    return (
        <TouchableOpacity className="w-[47vw] max-w-[180px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden p-4" onPress={() => {
            router.push(`/plant-care/${product.slug}`)
        }}>
            <View className="items-center">
                {imageLoading && (
                    <View className="w-full h-[17vh] max-h-[180px] rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                {product.image_url && <Image
                    source={{ uri: product.image_url }}
                    className={`w-full h-[17vh] max-h-[180px] rounded-md ${imageLoading ? 'absolute opacity-0' : ''}`}
                    resizeMode="contain"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                />}
            </View>
            <View className="flex-row justify-between items-start">
                <View className="mt-3 flex-1 mr-2">
                    <Text
                        className="text-[16px] font-pmedium text-primary-dark dark:text-primary-light"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {product.name}
                    </Text>
                </View>
            </View>
            <View className='flex-row justify-between items-center mt-2'>
                <View className='flex-col items-center'>
                    <View className='bg-yellow-500 rounded-full p-1'>
                        <Ionicons name="sunny" size={24} color="yellow" />
                    </View>
                    <Text className='text-primary-dark dark:text-primary-light text-center mt-2'>Sunny</Text>
                </View>
                <View className='flex-col items-center'>
                    <View className='bg-sky-500 rounded-full p-1'>
                        <Ionicons name="water" size={24} color="skyblue" />
                    </View>
                    <Text className='text-primary-dark dark:text-primary-light text-center mt-2'>100</Text>
                </View>
                <View className='flex-col items-center'>
                    <View className='bg-green-500 rounded-full p-1'>
                        <Ionicons name="thermometer-outline" size={24} color="yellow" opacity={0.7} />
                    </View>
                    <Text className='text-primary-dark dark:text-primary-light text-center mt-2'>130%</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default PlantCardSmall
