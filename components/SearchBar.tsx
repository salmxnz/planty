import { StyleSheet, Text, View, Image, TextInput, useColorScheme } from 'react-native'
import React from 'react'
import { icons } from '../constants'

interface SearchBarProps {
   value: string
   handleChangeText: (value: string) => void 
}

const SearchBar = ({ value, handleChangeText }: SearchBarProps) => {
    const colorScheme = useColorScheme();
    const iconTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#969ba3';

    return (
        <View className="flex-row items-center bg-[#eeeeee] dark:bg-[#1b1b1d] rounded-2xl w-full px-4 py-5">
            {/* Search Icon */}
            <Image
                source={icons.search}
                resizeMode="contain"
                className="w-6 h-6"
                style={{ tintColor: iconTintColor }}
            />

            {/* Search Input */}
            <TextInput
                placeholder="Search for a plant"
                className="text-base font-pregular ml-4 text-gray-500 dark:text-primary-light flex-1"
                value={value}
                onChangeText={handleChangeText}
                placeholderTextColor="#969ba3"
            />
        </View>
    )
}

export default SearchBar
