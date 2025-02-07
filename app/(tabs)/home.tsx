import { View, Text, Image } from 'react-native'
import React from 'react'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native'
import { images } from '@/constants'
import SearchBar from '@/components/SearchBar'
import { useState } from 'react'
import ProductCategories from '@/components/ProductCategories'

const Home = () => {

    const [searchTerm, setSearchTerm] = useState('')

    const handleChangeText = (text: string) => {
        setSearchTerm(text)
    }

    return (
        <SafeAreaView
            className="flex-1 bg-primary-light dark:bg-primary-dark"
            edges={['bottom']}
        >
            <GestureHandlerRootView className="flex-1">
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View className="w-full h-[18vh] bg-primary-light dark:bg-primary-dark justify-end ">
                        <View className="flex flex-row items-center justify-between w-full px-6">
                            <View>
                                <Text className="mb-2 text-gray-500 dark:text-gray-300 text-lg font-pregular">
                                    Welcome YoMama300
                                </Text>
                                <Text className="text-primary-dark dark:text-white text-4xl font-psemibold">
                                    Let's find{' '}
                                </Text>
                                <View className="flex flex-row">
                                    <Text className="text-primary-dark dark:text-white text-4xl font-psemibold">
                                        your perfect{' '}
                                    </Text>
                                    <Text className="text-accent-light dark:text-accent-dark text-4xl font-psemibold">
                                        plant
                                    </Text>
                                </View>
                            </View>
                            <Image
                                source={images.profileExample}
                                className="w-[40px] h-[40px] rounded-full shadow-[0px_20px_25px_10px_rgba(0,0,0,0.15)] dark:shadow-[0px_20px_25px_10px_rgba(250,250,250,0.15)]"
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <View className="flex-1 mt-6 ml-6">
                      <View className="mr-6">  
                        <SearchBar
                            value={searchTerm}
                            handleChangeText={handleChangeText}
                        />
                        </View>
                        <View className="mt-10">
                           <ProductCategories /> 
                        </View>
                        <View className="mt-7 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[4px_4px_9px_0px_rgba(250,250,250,0.16)]">
                        {/* <View className="mt-7 shadow-[0px_20px_25px_10px_rgba(0,0,0,0.15)] dark:shadow-[5px_5px_7px_0px_rgba(250,250,250,0.16)]">*/}
                          <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 23 }}
                            className="flex-row"
                          >
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                          </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Home
