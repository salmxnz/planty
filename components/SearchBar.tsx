import { StyleSheet, Text, View, Image, TextInput, useColorScheme, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface SearchBarProps {
    value: string
    handleChangeText: (value: string) => void
}

const SearchBar = ({ value, handleChangeText }: SearchBarProps) => {
    const colorScheme = useColorScheme()
    const iconTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#969ba3'
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (text: string) => {
        setSearchTerm(text)
        handleChangeText(text)
    }

    const handleClear = () => {
        setSearchTerm('')
        handleChangeText('')
    }

    const handleSubmit = () => {
        if (searchTerm.trim().length > 0) {
            // Navigate to search results screen with the search term as a parameter
            router.push(`/search/${encodeURIComponent(searchTerm.trim())}`)
        }
    }

    return (
        <View className="flex-row items-center bg-[#eeeeee] dark:bg-[#1b1b1d] rounded-2xl w-full px-4 py-5">
            {/* Search Icon */}
            <TouchableOpacity onPress={handleSubmit}>
                <Image
                    source={icons.search}
                    resizeMode="contain"
                    className="w-6 h-6"
                    style={{ tintColor: iconTintColor }}
                />
            </TouchableOpacity>

            {/* Search Input */}
            <TextInput
                placeholder="Search for a plant"
                className="text-base font-pregular ml-4 text-gray-500 dark:text-primary-light flex-1"
                value={searchTerm}
                onChangeText={handleSearch}
                placeholderTextColor="#969ba3"
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
            />

            {/* Clear Button */}
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={handleClear} className="ml-2">
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={colorScheme === 'dark' ? '#FFFFFF' : '#969ba3'}
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default SearchBar
