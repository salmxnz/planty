import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const ProductCategories = () => {
    const categories = ['Popular', 'Indoor', 'Outdoor', 'Fruits', 'Vegetables']
    const [activeCategory, setActiveCategory] = useState('Popular')
    // zustand global state management ?? or local state and pass to product category??
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row overflow-x-scroll horizontal-scrollbar-hidden pr-8"
                contentContainerStyle={{ gap: 27 }}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => setActiveCategory(category)}
                        className="pb-2"
                    >
                        <View className="items-center">
                            <Text className="text-gray-700 dark:text-primary-light text-2xl font-psemibold">
                                {category}
                            </Text>
                            {activeCategory === category && (
                                <View className="w-7 h-1 bg-accent-light dark:bg-accent-dark rounded-lg absolute -bottom-safe -bottom-2 self-center"></View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default ProductCategories
