import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ProductCard from './ProductCard'
// import { fetchProductsByCategory } from '../utils/data'

const CategorySection = ({ activeCategory }: { activeCategory: string }) => {
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
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
        </ScrollView>
    )
}

export default CategorySection
