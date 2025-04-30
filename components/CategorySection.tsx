import { ScrollView } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'
import SkeletonPlant from './SkeletonPlant'

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

const SkeletonPlantRow = () => {
    return (
        <>
            <SkeletonPlant />
            <SkeletonPlant />
            <SkeletonPlant />
        </>
    )
}

const CategorySection = ({
    activeCategory,
    plants,
    productLoading,
}: {
    activeCategory: number
    plants: Plant[]
    productLoading: boolean
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 23 }}
            className="flex-row"
        >
            {productLoading ? (
                <SkeletonPlantRow />
            ) : (
                plants.map((plant) => (
                    <ProductCard key={plant.id} product={plant} />
                ))
            )}
        </ScrollView>
    )
}

export default CategorySection
