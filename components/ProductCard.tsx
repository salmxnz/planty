import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import SphereButton from './sphere'
import { router } from 'expo-router';
// import { images } from '@/constants/index'

interface Product {
    id: string;
    name: string;
    slug: string;
    image_url: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <TouchableOpacity className="w-[50vw] max-w-[300px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden p-4" onPress={() => {
            router.push(`/plant-details/${product.slug}`)
        }}>
            <View className="items-center">
                <Image
                    source={{ uri: product.image_url }}
                    className="w-full h-[22vh] max-h-[180px] rounded-md"
                    resizeMode="contain"
                />
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
                <View className="mt-3">
                    <SphereButton />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductCard
