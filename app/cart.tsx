import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '@/context/CartProvider'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { CategoryNameFetchById } from '@/api/supabaseFunctions'

const Cart = () => {
    const {
        items,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
    } = useCart()
    const colorScheme = useColorScheme()
    const deliveryFee = 150 // Fixed delivery fee
    const [categoryNames, setCategoryNames] = useState<{[key: number]: string}>({})

    // Format price to display with 2 decimal places
    const formatPrice = (price: number) => {
        return `Rs ${price.toFixed(2)}`
    }

    // Calculate total amount
    const cartTotal = getCartTotal()
    const totalAmount = cartTotal + deliveryFee

    // Fetch category names for all items in the cart
    useEffect(() => {
        const fetchCategoryNames = async () => {
            const categoryIds = items.map(item => item.category_id).filter(id => id !== undefined);
            const uniqueCategoryIds = [...new Set(categoryIds)];
            
            const categoryNamesMap: {[key: number]: string} = {};
            
            for (const categoryId of uniqueCategoryIds) {
                if (categoryId) {
                    const name = await CategoryNameFetchById(categoryId);
                    if (name) {
                        categoryNamesMap[categoryId] = name;
                    }
                }
            }
            
            setCategoryNames(categoryNamesMap);
        };
        
        if (items.length > 0) {
            fetchCategoryNames();
        }
    }, [items]);

    return (
        <SafeAreaView
            className="flex-1 bg-primary-light dark:bg-primary-dark"
            edges={['top', 'bottom']}
        >
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                    />
                </TouchableOpacity>
                <Text className="text-3xl font-psemibold text-primary-dark dark:text-primary-light">
                    Cart
                </Text>
                <View className="h-11 w-11 bg-accent-light dark:bg-accent-dark rounded-full items-center justify-center">
                    <Text className="text-white dark:text-black font-psemibold text-xl">
                        {getCartCount()}
                    </Text>
                </View>
            </View>

            {items.length === 0 ? (
                // Empty cart view
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons
                        name="cart-outline"
                        size={100}
                        color={colorScheme === 'dark' ? '#9FF16D' : '#568030'}
                    />
                    <Text className="text-2xl font-pbold text-primary-dark dark:text-primary-light mt-4">
                        Your cart is empty
                    </Text>
                    <Text className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-6">
                        Looks like you haven't added any plants to your cart
                        yet.
                    </Text>
                    <TouchableOpacity
                        className="bg-accent-light dark:bg-accent-dark py-3 px-6 rounded-full"
                        onPress={() => router.push('/(tabs)/explore')}
                    >
                        <Text className="text-white dark:text-black font-pbold">
                            Explore Plants
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Cart with items
                <>
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="px-4 pb-4">
                            {items.map((item) => (
                                <View
                                    key={item.id}
                                    className="flex-row bg-white dark:bg-black-100 rounded-xl w-auto  px-5 py-4 mb-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)] items-center"
                                >
                                    {/* Plant Image */}
                                    <View className="h-[9vh] w-[9vh] bg-gray-50 dark:bg-black-200 rounded-xl overflow-hidden mr-3">
                                        <Image
                                            source={{ uri: item.image_url }}
                                            className="h-full w-full"
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Plant Details */}
                                    <View className="flex-1 justify-center">
                                        <View className="flex-row justify-between items-center">
                                          <View className="flex-col justify-center w-[60%]">
                                            <Text 
                                                className="font-psemibold text-primary-dark dark:text-primary-light text-xl"
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                {item.name}
                                            </Text>
                                            <View className="bg-white dark:bg-black-200">
                                              <Text className="font-pregular text-gray-500 dark:text-gray-400 text-md">
                                                {item.category_id && categoryNames[item.category_id] ? categoryNames[item.category_id] : 'Loading...'}
                                              </Text>
                                            </View>
                                            <Text className="font-pmedium text-primary-dark dark:text-primary-light text-lg">
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                )}
                                            </Text>
                                          </View>
                                        {/* Quantity Controls */}

                                            <View className="flex-row justify-end items-center">
                                            <View className="flex-row items-center">
                                                <TouchableOpacity
                                                    className="h-7 w-7 bg-gray-50 dark:bg-black-200 rounded-full items-center justify-center"
                                                    onPress={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="remove"
                                                        size={16}
                                                        color={
                                                            colorScheme ===
                                                            'dark'
                                                                ? '#ffffff'
                                                                : '#000000'
                                                        }
                                                    />
                                                </TouchableOpacity>

                                                <Text className="mx-3 font-pmedium text-primary-dark dark:text-primary-light">
                                                    {item.quantity}
                                                </Text>

                                                <TouchableOpacity
                                                    className="h-7 w-7 bg-gray-50 dark:bg-black-200 rounded-full items-center justify-center"
                                                    onPress={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="add"
                                                        size={16}
                                                        color={
                                                            colorScheme ===
                                                            'dark'
                                                                ? '#ffffff'
                                                                : '#000000'
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                        </View>
                                        
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* <TouchableOpacity
                                                onPress={() =>
                                                    removeFromCart(item.id)
                                                }
                                            >
                                                <Ionicons
                                                    name="trash-outline"
                                                    size={18}
                                                    color={
                                                        colorScheme === 'dark'
                                                            ? '#9FF16D'
                                                            : '#568030'
                                                    }
                                                />
                                            </TouchableOpacity> */}

                    {/* Order Summary */}
                    <View className="bg-white dark:bg-black-200 rounded-3xl px-6 pt-6 pb-8 w-auto mx-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-black font-pmedium text-lg">
                                Delivery Amount
                            </Text>
                            <Text className="text-black font-pmedium text-lg">
                                {formatPrice(deliveryFee)}
                            </Text>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <Text className="text-black text-xl font-pbold">
                                Total Amount
                            </Text>
                            <Text className="text-black text-xl font-pbold">
                                {formatPrice(totalAmount)}
                            </Text>
                        </View>

                        <TouchableOpacity className="bg-accent-light dark:bg-accent-dark rounded-full py-4 flex-row justify-center items-center">
                            <Text className="text-white dark:text-black font-pbold mr-2">
                                Make Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default Cart
