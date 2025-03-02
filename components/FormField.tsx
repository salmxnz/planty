import {
    Text,
    View,
    TextInput,
    Image,
    useColorScheme,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect} from 'react'
import images from '../constants/images'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialCommunityIcons as IconType } from '@expo/vector-icons'

interface FormFieldProps {
    imageIcon?: keyof typeof IconType.glyphMap
    title: string
    value: string
    forgetPassword?: boolean
    handleChangeText: (value: string) => void
    placeholder?: string
    otherStyles?: string
    keyboardType?: any
    secureTextEntry?: boolean
    autoComplete?: 'email' | 'off' | 'password' | 'username'
    isPassword?: boolean
    setSecureTextEntry?: (secureTextEntry: boolean) => void
    handleSecureTextEntry?: () => void
    textContentType?: 'none' | 'password' | 'username' | 'password' | 'newPassword' | 'username' | 'emailAddress' | 'oneTimeCode'
}

const FormField = ({
    title,
    imageIcon,
    value,
    handleChangeText,
    placeholder,
    otherStyles,
    keyboardType,
    isPassword,
    textContentType,
    autoComplete,
    forgetPassword,
    ...props
}: FormFieldProps) => {
    const colorScheme = useColorScheme()
    const iconTintColor = colorScheme === 'dark' ? '#CDCDE0' : '#3b3b3b'

    const [secureTextEntry, setSecureTextEntry] = useState(isPassword || false);

    console.log("Secure text entry:", secureTextEntry);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <View className='flex-row items-center justify-between'>
            <Text
                className={`text-base mb-1.5 ml-3 text-gray-600 dark:text-gray-400 font-pmedium`}
            >
                {title}
            </Text>
            {forgetPassword && (
                <Text className="flex-0 text-accent-light dark:text-accent-dark font-pmedium text-base ml-auto mb-1.5">Forgot password?</Text>
            )}
            </View>
            <View className="w-full h-16 bg-green-300 dark:bg-black-200 border-0 dark:border-black-200 rounded-2xl focus:border-secondary-200 flex-row items-center overflow-hidden">
                {/* {imageIcon && (
          <Image source={images[imageIcon]} className="w-10 h-10 mr-4" />
        )} */}
                {imageIcon && (
                    <View className="ml-4 mr-2 flex">
                        <MaterialCommunityIcons
                            name={imageIcon as keyof typeof IconType.glyphMap}
                            size={24}
                            color={iconTintColor}
                        />
                    </View>
                )}
                <TextInput
                    className={`flex-1 !text-primary-dark dark:!text-primary-light px-2 h-full !bg-transparent`}
                    value={value}
                    defaultValue={value}
                    onChangeText={(text) => {
                        console.log("TextInput updated:", text); // Debugging
                        handleChangeText(text);
                    }}
                    placeholder={placeholder}
                    placeholderTextColor="#6B7280"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlignVertical="center"
                    style={{ height: '100%' }}
                    textContentType={textContentType}
                    autoComplete={autoComplete}
                    importantForAutofill='yes'
                    enablesReturnKeyAutomatically
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => { setSecureTextEntry(!secureTextEntry) }}>
                        <View className="ml-4 mr-4 flex">
                            <MaterialCommunityIcons
                                name={secureTextEntry ? "eye" : "eye-off"}
                                size={24}
                                color={iconTintColor}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField
