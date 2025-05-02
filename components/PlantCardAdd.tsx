import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Plant } from '@/context/UserPlantsProvider'
import { useColorScheme } from 'nativewind'

interface PlantCardAddProps {
  plant: Plant;
  isAdded: boolean;
  onAddPress: (plant: Plant) => void;
}

const PlantCardAdd = ({ plant, isAdded, onAddPress }: PlantCardAddProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="w-[45vw] max-w-[170px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden p-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
      <View className="items-center">
        {imageLoading && (
          <View className="w-full h-[17vh] max-h-[180px] rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        {plant.image_url && (
          <Image
            source={{ uri: plant.image_url }}
            className={`w-full h-[17vh] max-h-[180px] rounded-md ${imageLoading ? 'absolute opacity-0' : ''}`}
            resizeMode="contain"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        )}
        <View className="absolute top-2 right-2 bg-[#1b1b1d] rounded-full px-2 py-1">
          <Text className="text-white text-xs font-pmedium">
            {plant.care_level || 'Easy'}
          </Text>
        </View>
      </View>
      <View className="mt-3">
        <Text
          className="text-[16px] font-pmedium text-primary-dark dark:text-primary-light"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {plant.name}
        </Text>
      </View>
      <TouchableOpacity
        className={`mt-3 py-2 rounded-full flex-row justify-center items-center ${
          isAdded 
            ? 'bg-gray-200 dark:bg-gray-700' 
            : 'bg-accent-light dark:bg-accent-dark'
        }`}
        onPress={() => onAddPress(plant)}
        disabled={isAdded}
      >
        {!isAdded && (
          <Ionicons 
            name="add" 
            size={16} 
            color={isDark ? '#000000' : '#FFFFFF'} 
            style={{ marginRight: 4 }}
          />
        )}
        <Text 
          className={`text-center font-pmedium text-sm ${
            isAdded 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-white dark:text-black'
          }`}
        >
          {isAdded ? 'Added' : 'Add Plant'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default PlantCardAdd
