import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    useColorScheme,
    TouchableOpacity,
    Modal,
    FlatList,
    ScrollView,
    GestureResponderEvent,
} from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Slider from '@react-native-community/slider'

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

interface SearchBarProps {
    value: string
    handleChangeText: (value: string) => void
    handleCategorySelect?: (categoryId: string) => void
    activeCategory?: string
    handleSizeSelect?: (size: string) => void
    selectedSize?: string
    handleCareLevelSelect?: (level: string) => void
    selectedCareLevel?: string
    priceRange?: number
    handlePriceRangeChange?: (price: number) => void
    handleClearAll?: () => void
    filteredPlants?: Plant[]
}

// Sample suggested plants using actual project assets
const suggestedPlants = [
    {
        id: '2',
        name: 'Monstera Deliciosa',
        slug: 'monstera-deliciosa',
        category: 'Indoor plants',
        image_url: require('../assets/images/plants/Monstera_Deliciosa.png'),
        care_level: 'Easy care',
    },
    {
        id: '6',
        name: 'Snake Plant',
        slug: 'snake-plant',
        category: 'Low light plants',
        image_url: require('../assets/images/plants/4x/Dracaena_trifasciata.png'),
        care_level: 'Very easy care',
    },
    {
        id: '9',
        name: 'Chinese Fan Palm',
        slug: 'chinese-fan-palm',
        category: 'Popular houseplants',
        image_url: require('../assets/images/plants/4x/Chinese_Fan_Palm_Livistona_CHinensis.png'),
        care_level: 'Moderate care',
    },
    {
        id: '8',
        name: 'Lucky Bamboo',
        slug: 'lucky-bamboo',
        category: 'Air purifying plants',
        image_url: require('../assets/images/plants/4x/Lucky_Bamboo_Dracaena_Sanderiana.png'),
        care_level: 'Easy to moderate',
    },
    {
        id: '11',
        name: 'English Ivy',
        slug: 'english-ivy',
        category: 'Trailing plants',
        image_url: require('../assets/images/plants/4x/English_Ivy.png'),
        care_level: 'Very easy care',
    },
]

// Categories for filtering
const categories = [
    { id: '1', name: 'Indoor', icon: 'home-outline' as const },
    { id: '2', name: 'Outdoor', icon: 'sunny-outline' as const },
    { id: '3', name: 'Pet-friendly', icon: 'paw-outline' as const },
    { id: '4', name: 'Low light', icon: 'moon-outline' as const },
    { id: '5', name: 'Easy care', icon: 'water-outline' as const },
    { id: '6', name: 'Popular', icon: 'star-outline' as const },
    { id: '7', name: 'Top Picks', icon: 'trophy-outline' as const },
]

// Plant size options
const sizeOptions = ['Small', 'Medium', 'Large']

// Care level options
const careLevelOptions = ['Easy', 'Moderate', 'Hard']

const SearchBarMaximize = ({ 
    value, 
    handleChangeText,
    handleCategorySelect,
    activeCategory = '',
    handleSizeSelect,
    selectedSize = '',
    handleCareLevelSelect,
    selectedCareLevel = '',
    priceRange = 5000,
    handlePriceRangeChange,
    handleClearAll,
    filteredPlants = []
}: SearchBarProps) => {
    const colorScheme = useColorScheme()
    const iconTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#969ba3'
    const [modalVisible, setModalVisible] = useState(false)

    const openSearchModal = () => {
        setModalVisible(true)
    }

    const closeSearchModal = () => {
        setModalVisible(false)
    }

    // Use the passed handlers if available, otherwise use local state
    const handleCategorySelectInternal = (categoryId: string) => {
        if (handleCategorySelect) {
            handleCategorySelect(categoryId)
        }
    }

    const handleSizeSelectInternal = (size: string) => {
        if (handleSizeSelect) {
            handleSizeSelect(size)
        }
    }

    const handleCareLevelSelectInternal = (level: string) => {
        if (handleCareLevelSelect) {
            handleCareLevelSelect(level)
        }
    }

    const handlePriceRangeChangeInternal = (price: number) => {
        if (handlePriceRangeChange) {
            handlePriceRangeChange(price)
        }
    }

    const handleClearAllInternal = () => {
        if (handleClearAll) {
            handleClearAll()
        } else {
            handleChangeText('')
        }
        closeSearchModal()
    }

    // Navigate to search results with filters
    const navigateToSearchResults = () => {
        // Create a filter object to pass as URL parameters
        const filters = {
            term: value,
            category: activeCategory,
            size: selectedSize,
            careLevel: selectedCareLevel,
            price: priceRange.toString()
        }
        
        // Convert filter object to URL-friendly query string
        const queryParams = Object.entries(filters)
            .filter(([_, val]) => val) // Remove empty values
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&')
        
        // Close modal and navigate
        closeSearchModal()
        router.push(`/search/filters?${queryParams}`)
    }

    // Determine which plants to display in the results
    const plantsToDisplay = filteredPlants && filteredPlants.length > 0 
        ? filteredPlants 
        : suggestedPlants

    return (
        <>
            <TouchableOpacity
                className="flex-row items-center bg-[#eeeeee] dark:bg-[#1b1b1d] rounded-2xl w-full px-4 py-5 relative"
                onPress={openSearchModal}
            >
                <View className="absolute left-4">
                    <Ionicons
                        name="filter"
                        size={24}
                        color={colorScheme === 'dark' ? '#CDCDE0' : '#3E3E3E'}
                    />
                </View>
                {/* Search Input */}
                <Text className="text-base font-pregular text-center text-gray-900 dark:text-primary-light w-full">
                    {value || 'Filter your plant'}
                </Text>
            </TouchableOpacity>

            {/* Search Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeSearchModal}
            >
                <View className="flex-1 bg-primary-light dark:bg-primary-dark pt-20">
                    {/* Header with close button */}
                    <View className="flex-row items-center px-6 pb-4">
                        <TouchableOpacity
                            onPress={closeSearchModal}
                            className="mr-4"
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color={
                                    colorScheme === 'dark'
                                        ? '#FFFFFF'
                                        : '#000000'
                                }
                            />
                        </TouchableOpacity>

                        <View className="flex-1 flex-row items-center bg-[#eeeeee] dark:bg-[#1b1b1d] rounded-2xl px-4 py-3">
                            <Image
                                source={icons.search}
                                resizeMode="contain"
                                className="w-5 h-5"
                                style={{ tintColor: iconTintColor }}
                            />
                            <TextInput
                                placeholder="Search for a plant"
                                className="text-base font-pregular ml-3 text-gray-500 dark:text-primary-light flex-1"
                                value={value}
                                onChangeText={handleChangeText}
                                placeholderTextColor="#969ba3"
                                autoFocus
                            />
                            {value.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => handleChangeText('')}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={18}
                                        color={
                                            colorScheme === 'dark'
                                                ? '#FFFFFF'
                                                : '#969ba3'
                                        }
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="px-6 pt-3 pb-24">
                            {/* Categories */}
                            <Text className="text-xl font-pmedium text-primary-dark dark:text-white mb-4">
                                Categories
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="mb-6"
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() =>
                                            handleCategorySelectInternal(category.id)
                                        }
                                        className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                                            activeCategory === category.id
                                                ? 'bg-accent-light dark:bg-accent-dark'
                                                : 'bg-[#eeeeee] dark:bg-[#1b1b1d]'
                                        }`}
                                    >
                                        <Ionicons
                                            name={category.icon}
                                            size={16}
                                            color={
                                                activeCategory === category.id
                                                    ? colorScheme === 'dark'
                                                        ? '#000000'
                                                        : '#ffffff'
                                                    : colorScheme === 'dark'
                                                    ? '#FFFFFF'
                                                    : '#969ba3'
                                            }
                                            className="mr-2"
                                        />
                                        <Text
                                            className={`font-pregular ${
                                                activeCategory === category.id
                                                    ? 'text-white dark:text-black'
                                                    : 'text-gray-500 dark:text-primary-light'
                                            }`}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Filters Section */}
                            <View className="mb-6">
                                {/* Size Filter */}
                                <Text className="text-xl font-pmedium text-primary-dark dark:text-white mb-3">
                                    Size
                                </Text>
                                <View className="flex-row mb-4">
                                    {sizeOptions.map((size, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() =>
                                                handleSizeSelectInternal(size)
                                            }
                                            className={`mr-3 px-6 py-2 rounded-lg ${
                                                selectedSize === size
                                                    ? 'bg-accent-light dark:bg-accent-dark'
                                                    : 'bg-[#eeeeee] dark:bg-[#1b1b1d]'
                                            }`}
                                        >
                                            <Text
                                                className={`font-pregular ${
                                                    selectedSize === size
                                                        ? 'text-white dark:text-black'
                                                        : 'text-gray-500 dark:text-primary-light'
                                                }`}
                                            >
                                                {size}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Price Range Slider - Using @react-native-community/slider */}
                                <Text className="text-xl font-pmedium text-primary-dark dark:text-white mt-2 mb-2">
                                    Price Range
                                </Text>
                                <View className="mb-4">
                                    <Slider
                                        minimumValue={0}
                                        maximumValue={5000}
                                        step={100}
                                        value={priceRange}
                                        onValueChange={handlePriceRangeChangeInternal}
                                        minimumTrackTintColor={
                                            colorScheme === 'dark'
                                                ? '#ffffff'
                                                : '#000000'
                                        }
                                        maximumTrackTintColor={
                                            colorScheme === 'dark'
                                                ? '#555555'
                                                : '#DDDDDD'
                                        }
                                        thumbTintColor={
                                            colorScheme === 'dark'
                                                ? '#ffffff'
                                                : '#000000'
                                        }
                                        style={{ height: 40 }}
                                    />
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-pregular text-gray-500">
                                            Rs 0
                                        </Text>
                                        <Text className="text-sm font-pmedium text-accent-light dark:text-accent-dark">
                                            Rs {priceRange}
                                        </Text>
                                        <Text className="text-sm font-pregular text-gray-500">
                                            Rs 5000
                                        </Text>
                                    </View>
                                </View>

                                {/* Care Level Filter */}
                                <Text className="text-xl font-pmedium text-primary-dark dark:text-white mb-3">
                                    Care Level
                                </Text>
                                <View className="flex-row mb-4">
                                    {careLevelOptions.map((level, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() =>
                                                handleCareLevelSelectInternal(level)
                                            }
                                            className={`mr-3 px-6 py-2 rounded-lg ${
                                                selectedCareLevel === level
                                                    ? 'bg-accent-light dark:bg-accent-dark'
                                                    : 'bg-[#eeeeee] dark:bg-[#1b1b1d]'
                                            }`}
                                        >
                                            <Text
                                                className={`font-pregular ${
                                                    selectedCareLevel === level
                                                        ? 'text-white dark:text-black'
                                                        : 'text-gray-500 dark:text-primary-light'
                                                }`}
                                            >
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Plants Results Section */}
                            <Text className="text-lg font-pmedium text-primary-dark dark:text-white mb-4">
                                {filteredPlants && filteredPlants.length > 0 
                                    ? `Found ${filteredPlants.length} plants` 
                                    : "Suggested plants"}
                            </Text>
                            
                            {/* Display "No results" message if no plants match the filters */}
                            {filteredPlants && filteredPlants.length === 0 && value.length > 0 && (
                                <View className="items-center py-8">
                                    <Ionicons 
                                        name="search-outline" 
                                        size={48} 
                                        color={colorScheme === 'dark' ? '#555555' : '#DDDDDD'} 
                                    />
                                    <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
                                        No plants match your search criteria.
                                    </Text>
                                    <TouchableOpacity 
                                        className="mt-4" 
                                        onPress={handleClearAllInternal}
                                    >
                                        <Text className="text-accent-light dark:text-accent-dark font-pmedium">
                                            Clear filters
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            
                            {/* Display plant results */}
                            {plantsToDisplay.map((item: any) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className="flex-row items-center mb-6"
                                    onPress={() => {
                                        closeSearchModal()
                                        // Navigate to plant details page
                                        router.push(`/plant-details/${item.slug}`);
                                    }}
                                >
                                    <View className="w-14 h-14 bg-[#f8f8f8] dark:bg-[#2a2a2a] rounded-lg items-center justify-center mr-4 overflow-hidden">
                                        <Image
                                            source={typeof item.image_url === 'string' 
                                                ? { uri: item.image_url } 
                                                : item.image_url}
                                            className="w-12 h-12"
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-pmedium text-primary-dark dark:text-white">
                                            {item.name}
                                        </Text>
                                        <Text className="text-sm font-pregular text-gray-500">
                                            {item.category || `Rs ${item.price}`}
                                        </Text>
                                    </View>
                                    <Text className="text-xs font-pregular text-accent-light dark:text-accent-dark">
                                        {item.care_level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Bottom Action Buttons */}
                    <View className="absolute bottom-0 left-0 right-0 px-8 py-10 border-t border-gray-50 dark:border-gray-900 bg-primary-light dark:bg-primary-dark flex-row justify-between">
                        <TouchableOpacity
                            onPress={handleClearAllInternal}
                            className="py-4"
                        >
                            <Text className="text-base font-pmedium text-primary-dark dark:text-white underline">
                                Clear all
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-accent-light dark:bg-accent-dark rounded-full px-8 py-4"
                            onPress={navigateToSearchResults}
                        >
                            <Text className="text-base font-pmedium text-white dark:text-black">
                                Search
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default SearchBarMaximize
