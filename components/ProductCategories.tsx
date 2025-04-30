import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[]
    activeCategory: number
    setActiveCategory: (categoryId: number) => void
    categoryLoading: boolean
}

const ProductCategories = ({ categories, activeCategory, setActiveCategory, categoryLoading }: Props) => {
    return (
        <View>
            {categoryLoading ? (
                        <View className="flex-row items-center justify-between w-full">
                            <View className="flex-row gap-10">
                                <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                                <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                                <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                                <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                            </View>
                        </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                className="flex-row overflow-x-scroll horizontal-scrollbar-hidden pr-8"
                contentContainerStyle={{ gap: 27 }}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => setActiveCategory(Number(category.id))}
                        className="pb-2"
                    >
                        <View className="items-center">
                            <Text className="text-gray-700 dark:text-primary-light text-2xl font-psemibold">
                                {category.name}
                            </Text>
                            {activeCategory === Number(category.id) && (
                                <View className="w-7 h-1 bg-accent-light dark:bg-accent-dark rounded-lg absolute -bottom-safe -bottom-2 self-center"></View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            )}
        </View>
    )
}

export default ProductCategories
