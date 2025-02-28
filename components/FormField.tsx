import { Text, View, TextInput, Image, useColorScheme } from 'react-native'
import React from 'react'
import images from '../constants/images'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialCommunityIcons as IconType } from '@expo/vector-icons'


interface FormFieldProps {
    imageIcon?: keyof typeof IconType.glyphMap
    title: string
    value: string
    handleChangeText: (value: string) => void
    placeholder?: string
    otherStyles?: string
    keyboardType?: any
    secureTextEntry?: boolean
}

const FormField = ({
    title,
    imageIcon,
    value,
    handleChangeText,
    placeholder,
    otherStyles,
    keyboardType,
    secureTextEntry,
    ...props
}: FormFieldProps) => {
    const colorScheme = useColorScheme();
    const iconTintColor = colorScheme === 'dark' ? 'white' : 'black';

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text
                className={`text-base mb-1.5 text-gray-600 dark:text-gray-400 font-pmedium`}
            >
                {title}
            </Text>
            <View className="w-full h-16 bg-green-300 dark:bg-black-200 border-0 dark:border-black-200 rounded-2xl focus:border-secondary-200 flex-row items-center">
                {/* {imageIcon && (
          <Image source={images[imageIcon]} className="w-10 h-10 mr-4" />
        )} */}
                {imageIcon && (
                    <View className="ml-4 mr-2">
                        <MaterialCommunityIcons
                            name={imageIcon as keyof typeof IconType.glyphMap}
                            size={24}
                            color={iconTintColor}
                        />
                    </View>
                )}
                <TextInput
                    className={`flex-1 text-primary-dark dark:text-white px-2 h-full`}
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#6B7280"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlignVertical="center"
                    style={{ height: '100%' }}
                />
            </View>
        </View>
    )
}

export default FormField
