import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native'
import React from 'react'
import ProductCard from '@/components/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native'
import SearchBar from '@/components/SearchBar'
import { useState, useEffect } from 'react'
import ProductCategories from '@/components/ProductCategories'
import { StatusBar } from 'expo-status-bar'
import CategorySection from '@/components/CategorySection'
import { useAuth } from '@/context/AuthProvider'
import { router } from 'expo-router'
import DisplayPicture from '@/components/DisplayPicture'
import Loading from '@/components/Loading'
import { CategoriesFetch, PlantsFetch, PlantsFetchByCategory, FeaturesFetch } from '@/api/supabaseFunctions'
import SkeletonPlant from '@/components/SkeletonPlant'
import SkeletonDiscover from '@/components/SkeletonDiscover'
import DiscoverCard from '@/components/DiscoverCard'
import { useColorScheme } from '@/hooks/useColorScheme'

//define categories interface
interface Category {
    id: string
    name: string
    slug: string
}

//define featured section interface
interface Feature {
    id: number
    name: string
    img_url: string
}

//define plants interface
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

const Home = () => {
    //categories fetch in main home component
    const colorScheme = useColorScheme()
    const [activeCategory, setActiveCategory] = useState<number>(1)
    const [productLoading, setProductLoading] = useState<boolean>(true)
    const [categoryLoading, setCategoryLoading] = useState<boolean>(true)
    const [discoverLoading, setDiscoverLoading] = useState<boolean>(true)

    const [categories, setCategories] = useState<Category[]>([])
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await CategoriesFetch()
            setCategories(categories as Category[])
            setCategoryLoading(false)
        }
        fetchCategories()
    }, [])

    //plants fetch in main home component
    const [plants, setPlants] = useState<Plant[]>([])
    useEffect(() => {
        const fetchPlants = async () => {
            const plants = await PlantsFetch()
            setPlants(plants.plants as Plant[])
            setProductLoading(false)
        }
        fetchPlants()
    }, [])

    //features fetch in main home component
    const [features, setFeatures] = useState<Feature[]>([])
    useEffect(() => {
        const fetchFeatures = async () => {
            const features = await FeaturesFetch()
            setFeatures(features as Feature[])
            setDiscoverLoading(false)
        }
        fetchFeatures()
    }, [])

    //plants fetch by category in main home component
    const [categoryPlants, setCategoryPlants] = useState<Plant[]>([])
    // Cache to store already loaded category plants
    const [loadedCategories, setLoadedCategories] = useState<{[key: number]: Plant[]}>({})
    
    useEffect(() => {
        const fetchCategoryPlants = async () => {
            // Check if this category has already been loaded
            if (loadedCategories[activeCategory]) {
                // Use cached data
                setCategoryPlants(loadedCategories[activeCategory])
                return
            }
            
            // Only set loading if we need to fetch
            setProductLoading(true)
            const plants = await PlantsFetchByCategory(activeCategory)
            const categoryPlants = plants.plants as Plant[]
            
            // Update the cache
            setLoadedCategories(prev => ({
                ...prev,
                [activeCategory]: categoryPlants
            }))
            
            setCategoryPlants(categoryPlants)
            setProductLoading(false)
        }
        
        fetchCategoryPlants()
    }, [activeCategory, loadedCategories])

    //search
    const [searchTerm, setSearchTerm] = useState('')
    const { session, username, website, avatarUrl, isLoading } = useAuth()

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
        return <Loading />
    }

    // Double-check authentication before rendering protected content
    if (!session) {
        // This is a fallback in case the useEffect hasn't redirected yet
        return <Loading />
    }

    console.log('Home component - username:', username)
    console.log('Home component - session:', session?.user?.id)
    console.log('Home component - avatarUrl:', avatarUrl)

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
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
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
                                onPress={() => router.push('/screens/_profile')}
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
                            <ProductCategories
                                categoryLoading={categoryLoading}
                                categories={categories}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                            />
                        </View>
                        <View className="mt-7 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                            <CategorySection
                                activeCategory={activeCategory}
                                plants={categoryPlants}
                                productLoading={productLoading}
                            />
                        </View>
                        {/* <View className="mt-7 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                            <SkeletonPlant />
                        </View>
                        <View className="mt-7 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                            <SkeletonPlant />
                        </View> */}
                        <View className='w-full h-10 mt-7'>
                            <Text className="text-primary-dark dark:text-primary-light text-3xl font-bold">
                                Discover
                            </Text>
                        </View>
                        {discoverLoading ? (
                        <View className="mt-5 mr-6 gap-4 flex-row flex-wrap justify-center shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                            <SkeletonDiscover />
                            <SkeletonDiscover />
                            <SkeletonDiscover />
                            <SkeletonDiscover />
                        </View>
                        ) : (
                            <View className="mt-5 mr-6 gap-4 flex-row flex-wrap justify-center shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                                {features.map((feature, index) => (
                                    <DiscoverCard key={index} feature={feature} onPress={() => router.push(`/features/${feature.id}`)}/>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
                {colorScheme === 'dark' ? (
                    <StatusBar style="light" backgroundColor="#161622" />
                ) : (
                    <StatusBar style="dark" backgroundColor="#fff" />
                )}
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Home
