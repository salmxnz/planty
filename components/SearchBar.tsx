import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

interface SearchBarProps {
   value: string
   handleChangeText: (value: string) => void 
}

const SearchBar = ({ value, handleChangeText }: SearchBarProps) => {
    return (
        <View className="flex-row items-center bg-[#eeeeee] dark:bg-[#1b1b1d] rounded-2xl py-5 px-4">
            <View>
                <MaskedView
                    maskElement={
                        <Image
                            source={icons.search}
                            resizeMode="contain"
                            className="w-8 h-8"
                            style={{
                                tintColor: '#000000',
                                width: 20,
                                height: 20,
                            }}
                        />
                    }
                >
                    <LinearGradient
                        colors={['#969ba3', '#969ba3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            width: 20,
                            height: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                </MaskedView>

            </View>
            <View>
            <TextInput
                    placeholder="Search for a plant"
                    className="text-xl font-pregular ml-4 text-gray-500 dark:text-primary-light"
                    value={value}
                    onChangeText={handleChangeText}
                />
            </View>
        </View>
    )
}

export default SearchBar


