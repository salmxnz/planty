import { Text, View, Image } from 'react-native'
import React from 'react'
import SphereButton from './sphere'
import { NavigationContainer } from '@react-navigation/native'
import { images } from '@/constants/index'
import { TouchableOpacity } from 'react-native'

const ProductCard = () => {
    return (
        <NavigationContainer>
        <TouchableOpacity className='w-[53vw] h-[30vh] relative bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden'>
        {/* <View className="w-[47%] h-[30vh] relative bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden"> */}
            <View className="mt-5 mb-2">
                <Image
                source={images.peperomia}
                className="w-[95%] h-[22vh] absolute"
                resizeMode="contain"
                />
            </View>
            <View>
            <Text className="text-xl font-semibold font-pmedium w-[100px] left-[14px] top-[21vh] text-primary-dark dark:text-primary-light">
                Peperomia Houseplant
            </Text>
            </View>
            <View className="absolute bottom-4 right-4">
                <SphereButton />
            </View>
        {/* </View> */}
        </TouchableOpacity>
        </NavigationContainer>
    )
}

export default ProductCard

