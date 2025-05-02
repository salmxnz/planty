import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface StatsCardProps {
  title: string
  value: string | number
  iconName: keyof typeof Ionicons.glyphMap
  iconColor: string
  iconBgColor: string
  description?: string
}

const StatsCard = ({ title, value, iconName, iconColor, iconBgColor, description }: StatsCardProps) => {
  return (
    <View className="bg-primary-light dark:bg-black-100 rounded-2xl p-4 flex-1 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
      <View className="flex-row items-center mb-3">
        <View className={`${iconBgColor} rounded-full p-2 mr-2`}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <Text className="text-text-light dark:text-primary-light font-pmedium text-base">{title}</Text>
      </View>
      <Text className="text-text-light dark:text-primary-light font-pbold text-2xl mb-1">{value}</Text>
      {description && (
        <Text className="text-gray-500 dark:text-gray-100 font-pregular text-xs">{description}</Text>
      )}
    </View>
  )
}

export default StatsCard