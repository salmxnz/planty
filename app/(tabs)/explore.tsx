import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Ionicons } from '@expo/vector-icons'
import SearchBarMaximize from '../../components/SearchBarMaximize'
import ProductCard from '../../components/ProductCard'
import { AllPlantsFetch, PlantByFeaturesFetch, PlantFetchByTrait } from '../../api/supabaseFunctions'
import SkeletonPlant from '@/components/SkeletonPlant'
import { useCart } from '@/context/CartProvider';
import { router } from 'expo-router';

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
    const { getCartCount } = useCart();
    const feature = {
        name: 'Explore',
    }
    
    // State for all plants and filtered plants
    const [allPlants, setAllPlants] = useState<Plant[]>([])
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
    const [loading, setLoading] = useState(true)

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedCareLevel, setSelectedCareLevel] = useState('')
    const [priceRange, setPriceRange] = useState(5000)

    // State for featured plants
    const [popularPlants, setPopularPlants] = useState<Plant[]>([])
    const [topPicksPlants, setTopPicksPlants] = useState<Plant[]>([])
    const [lowLightPlants, setLowLightPlants] = useState<Plant[]>([])
    const [easyCarePlants, setEasyCarePlants] = useState<Plant[]>([])
    const [petFriendlyPlants, setPetFriendlyPlants] = useState<Plant[]>([])

    // Mapping of category IDs to category names
    const categoryMap = {
        '1': 'Indoor',
        '2': 'Outdoor',
        '3': 'Pet-friendly',
        '4': 'Low light',
        '5': 'Easy care',
        '6': 'Popular',
        '7': 'Top Picks',
    }

    // Fetch all plants on component mount
    useEffect(() => {
        const fetchAllPlants = async () => {
            try {
                const plants = await AllPlantsFetch()
                if (plants) {
                    setAllPlants(plants as Plant[])
                    setFilteredPlants(plants as Plant[])
                }
            } catch (error) {
                console.error('Error fetching all plants:', error)
            }
        }

        const fetchFeaturedPlants = async () => {
            try {
                // Fetch popular plants (feature_id = 1)
                const popular = await PlantByFeaturesFetch(1)
                if (popular) setPopularPlants(popular as Plant[])

                // Fetch top picks plants (feature_id = 2)
                const topPicks = await PlantByFeaturesFetch(2)
                if (topPicks) setTopPicksPlants(topPicks as Plant[])

                // Fetch plants by traits - using existing function structure
                const lowLight = await PlantFetchByTrait('Low Light', '')
                if (lowLight) setLowLightPlants(lowLight as Plant[])

                const easyCare = await PlantFetchByTrait('Easy Care', '')
                if (easyCare) setEasyCarePlants(easyCare as Plant[])

                const petFriendly = await PlantFetchByTrait('Pet Friendly', '')
                if (petFriendly) setPetFriendlyPlants(petFriendly as Plant[])
            } catch (error) {
                console.error('Error fetching featured plants:', error)
            } finally {
                setLoading(false)
                setProductLoading(false)
            }
        }

        fetchAllPlants()
        fetchFeaturedPlants()
    }, [])

    // Apply all filters
    const applyFilters = () => {
        let filtered = [...allPlants]

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter(plant =>
                plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plant.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply category filter
        if (activeCategory) {
            switch (activeCategory) {
                case '1': // Indoor
                    filtered = filtered.filter(plant => plant.category_id === 1)
                    break
                case '2': // Outdoor
                    filtered = filtered.filter(plant => plant.category_id === 2)
                    break
                case '3': // Pet-friendly
                    filtered = filtered.filter(plant => 
                        petFriendlyPlants.some(p => p.id === plant.id)
                    )
                    break
                case '4': // Low light
                    filtered = filtered.filter(plant => 
                        lowLightPlants.some(p => p.id === plant.id)
                    )
                    break
                case '5': // Easy care
                    filtered = filtered.filter(plant => 
                        easyCarePlants.some(p => p.id === plant.id)
                    )
                    break
                case '6': // Popular
                    filtered = filtered.filter(plant => 
                        popularPlants.some(p => p.id === plant.id)
                    )
                    break
                case '7': // Top Picks
                    filtered = filtered.filter(plant => 
                        topPicksPlants.some(p => p.id === plant.id)
                    )
                    break
                default:
                    break
            }
        }

        // Apply size filter
        if (selectedSize) {
            // This is a placeholder. Adjust based on your actual data structure
            switch (selectedSize) {
                case 'Small':
                    filtered = filtered.filter(plant => plant.price < 1000)
                    break
                case 'Medium':
                    filtered = filtered.filter(plant => plant.price >= 1000 && plant.price <= 3000)
                    break
                case 'Large':
                    filtered = filtered.filter(plant => plant.price > 3000)
                    break
                default:
                    break
            }
        }

        // Apply care level filter
        if (selectedCareLevel) {
            filtered = filtered.filter(plant => 
                plant.care_level.toLowerCase().includes(selectedCareLevel.toLowerCase())
            )
        }

        // Apply price range filter
        filtered = filtered.filter(plant => plant.price <= priceRange)

        setFilteredPlants(filtered)
    }

    // Apply filters whenever any filter changes
    useEffect(() => {
        applyFilters()
    }, [searchTerm, activeCategory, selectedSize, selectedCareLevel, priceRange])

    // Handle search term change
    const handleSearchChange = (text: string) => {
        setSearchTerm(text)
    }

    // Handle category selection
    const handleCategorySelect = (categoryId: string) => {
        setActiveCategory(categoryId === activeCategory ? '' : categoryId)
    }

    // Handle size selection
    const handleSizeSelect = (size: string) => {
        setSelectedSize(size === selectedSize ? '' : size)
    }

    // Handle care level selection
    const handleCareLevelSelect = (level: string) => {
        setSelectedCareLevel(level === selectedCareLevel ? '' : level)
    }

    // Handle price range change
    const handlePriceRangeChange = (price: number) => {
        setPriceRange(price)
    }

    // Handle clear all filters
    const handleClearAll = () => {
        setSearchTerm('')
        setActiveCategory('')
        setSelectedSize('')
        setSelectedCareLevel('')
        setPriceRange(5000)
    }

    return (
        <SafeAreaView
            className="flex-1 bg-primary-light dark:bg-primary-dark"
            edges={['bottom', 'top']}
        >
            <GestureHandlerRootView className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    <View className="flex-1">
                        <View className="pt-6" />

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
                                <TouchableOpacity 
                                    className="p-4 rounded-full bg-primary-dark dark:bg-primary-light"
                                    onPress={() => router.push('/cart')}
                                >
                                    <View>
                                        <Ionicons
                                            name="bag-handle-outline"
                                            size={20}
                                            color={
                                                colorScheme === 'dark'
                                                    ? '#3e3e3e'
                                                    : '#ffffff'
                                            }
                                        />
                                        {getCartCount() > 0 && (
                                            <View className="absolute -top-1 -right-1 h-4 w-4 bg-accent-light dark:bg-accent-dark rounded-full items-center justify-center">
                                                <Text className="text-white dark:text-black font-pbold text-[10px]">
                                                    {getCartCount()}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="px-6 mt-6">
                            <SearchBarMaximize
                                value={searchTerm}
                                handleChangeText={handleSearchChange}
                                handleCategorySelect={handleCategorySelect}
                                activeCategory={activeCategory}
                                handleSizeSelect={handleSizeSelect}
                                selectedSize={selectedSize}
                                handleCareLevelSelect={handleCareLevelSelect}
                                selectedCareLevel={selectedCareLevel}
                                priceRange={priceRange}
                                handlePriceRangeChange={handlePriceRangeChange}
                                handleClearAll={handleClearAll}
                                filteredPlants={filteredPlants}
                            />
                        </View>
                        
                        {/* Popular Plants Section - Feature ID 1 */}
                        {popularPlants.length > 0 && (
                            <>
                                <View className="px-6 mt-8 flex-row items-center gap-3">
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
                                            popularPlants.map((plant: Plant) => (
                                                <ProductCard
                                                    key={plant.id}
                                                    product={plant}
                                                />
                                            ))
                                        )}
                                    </ScrollView>
                                </View>
                            </>
                        )}
                        
                        {/* Top Picks Section - Feature ID 2 */}
                        {topPicksPlants.length > 0 && (
                            <>
                                <View className="px-6 mt-8 flex-row items-center gap-3">
                                    <Ionicons
                                        name="trophy-outline"
                                        size={26}
                                        color={
                                            colorScheme === 'dark'
                                                ? '#ffffff'
                                                : '#000000'
                                        }
                                    />
                                    <Text className="text-2xl font-psemibold text-primary-dark dark:text-primary-light">
                                        Top Picks
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
                                            topPicksPlants.map((plant: Plant) => (
                                                <ProductCard
                                                    key={plant.id}
                                                    product={plant}
                                                />
                                            ))
                                        )}
                                    </ScrollView>
                                </View>
                            </>
                        )}

                        {/* Pet Friendly Plants */}
                        {petFriendlyPlants.length > 0 && (
                            <>
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
                            </>
                        )}

                        {/* Low Light Plants */}
                        {lowLightPlants.length > 0 && (
                            <>
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
                            </>
                        )}

                        {/* Easy Care Plants */}
                        {easyCarePlants.length > 0 && (
                            <>
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
                            </>
                        )}
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default Explore
