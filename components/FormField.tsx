import {Text, View, TextInput, Pressable } from 'react-native'
import React from 'react'

interface FormFieldProps {
    title: string,
    value: string,
    handleChangeText: (value: string) => void,
    placeholder?: string
    otherStyles?: string
    keyboardType?: any
}

const FormField = ({title, value, handleChangeText, placeholder, otherStyles, keyboardType, ...props}: FormFieldProps) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base text-gray-100 font-pmedium`}>{title}</Text>
      <View  className="w-full h-16 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary-200  ">
      <TextInput
        className={`flex-1 rounded-lg text-white px-4`}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
      />
      </View>
    </View>
  )
}

export default FormField
