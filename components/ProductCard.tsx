import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import SphereButton from './sphere'
import { images } from '@/constants/index'

const ProductCard = () => {
    return (
        <TouchableOpacity className="w-[50vw] max-w-[300px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden p-4">
            <View className="items-center">
                <Image
                    source={images.peperomia}
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
                        Peperomia Houseplant TTTTTTTT TTTTTTT TTTTTTT
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
