import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'
// import { Plant } from '@/types'

interface Plant {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    price: number;  
    category_id: number;
    stock_quantity: number;
    care_level: string;
    light_requirements: string;
    water_frequency: string;
    pet_friendly: boolean;
    // category: Category;
}

const   CategorySection = ({ activeCategory, plants }: { activeCategory: number, plants: Plant[] }) => {
    // const products = fetchProductsByCategory(activeCategory)

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 23 }}
            className="flex-row"
        >
            {/* active category */}
            {/* {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))} */}
            {plants.filter((plant) => plant.category_id === activeCategory).map((plant) => (
                <ProductCard key={plant.id} product={plant} />
            ))}
        </ScrollView>   
    )
}

export default CategorySection
