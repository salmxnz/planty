import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native'
import React from 'react'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ScrollView} from 'react-native'
import SearchBar from '@/components/SearchBar'
import { useState, useEffect } from 'react'
import ProductCategories from '@/components/ProductCategories'
import { StatusBar } from 'expo-status-bar'
import CategorySection from '@/components/CategorySection'
import { useAuth } from '@/context/AuthProvider'
import { router } from "expo-router";
import DisplayPicture from '@/components/DisplayPicture'
import Loading from '@/components/Loading'

interface Category {
    id: string;
    name: string;
    slug: string;
}

const Home = () => {
    //categories
    const [activeCategory, setActiveCategory] = useState<string>('1');
    const categories: Category[] = [
        { id: '1', name: 'Popular', slug: 'popular' },
        { id: '2', name: 'Indoor', slug: 'indoor' },
        { id: '3', name: 'Outdoor', slug: 'outdoor' },
        { id: '4', name: 'Fruits', slug: 'fruits' },
        { id: '5', name: 'Vegetables', slug: 'vegetables' },
    ]
    //search
    const [searchTerm, setSearchTerm] = useState('')
    const { session, username, website, avatarUrl, isLoading} = useAuth()

    // Enhanced authentication check with back handler
    // useEffect(() => {
    //     // Redirect to sign-in if not authenticated
    //     if (!session && !isLoading) {
    //         router.replace("/sign-in");
    //         return;
    //     }

    //     // Handle back button press to prevent unauthorized access after logout
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //         // If session is null (logged out), prevent going back
    //         if (!session) {
    //             router.replace("/sign-in");
    //             return true; // Prevent default behavior
    //         }
    //         return false; // Let default behavior happen when authenticated
    //     });

    //     return () => backHandler.remove();
    // }, [session, isLoading]);

    // If still loading or no session, show loading screen
    if (isLoading) {
        return <Loading />;
    }

    // Double-check authentication before rendering protected content
    if (!session) {
        // This is a fallback in case the useEffect hasn't redirected yet
        return <Loading />;
    }

    console.log("Home component - username:", username)
    console.log("Home component - session:", session?.user?.id)
    console.log("Home component - avatarUrl:", avatarUrl)
    
    const handleChangeText = (text: string) => {
        setSearchTerm(text)
    }
    
    //display
    return (
        <SafeAreaView
            className="flex-1 bg-primary-light dark:bg-primary-dark"
            edges={['bottom']}
        >
            <GestureHandlerRootView className="flex-1">
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View className="w-full h-[19vh] bg-primary-light dark:bg-primary-dark justify-end ">
                        <View className="flex flex-row items-center justify-between w-full px-6">
                            <View>
                                <Text className="mb-2 text-gray-500 dark:text-gray-300 text-lg font-pregular">
                                    Welcome {username || 'Guest'} 
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
                            <TouchableOpacity
                            onPress={() => router.push("/screens/_profile")}
                            >
                            <DisplayPicture url={avatarUrl} size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-1 mt-6 ml-6">
                        <View className="mr-6">
                            <SearchBar
                                value={searchTerm}
                                handleChangeText={handleChangeText}
                            />
                        </View>
                        <View className="mt-7">
                            <ProductCategories categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                        </View>
                        <View className="mt-7 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                          <CategorySection activeCategory={activeCategory} /> 
                        </View>
                    </View>
                </ScrollView>
                <StatusBar style="light" backgroundColor="#161622" />
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Home
