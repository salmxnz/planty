import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useUserPlants, Plant } from '@/context/UserPlantsProvider'
import { useColorScheme } from 'nativewind'
import { format, parseISO, subDays } from 'date-fns'

// Define types for the care action button props
interface CareActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | number;
  color: string;
  bgColor: string;
  onPress: () => void;
  isActive?: boolean;
}

// Define types for the history data
interface HistoryItem {
  date: string;
  value: number;
  label: string;
}

interface CareHistoryGraphProps {
  historyData: HistoryItem[];
  type: 'water' | 'light' | 'humidity';
}

// Component for the care action buttons (water, light, etc.)
const CareActionButton: React.FC<CareActionButtonProps> = ({ 
  icon, 
  label, 
  value, 
  color, 
  bgColor, 
  onPress,
  isActive = false
}) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View className="items-center">
      <TouchableOpacity 
        className={`${bgColor} rounded-full p-3 mb-2 ${isActive ? 'border-2 border-accent-light dark:border-accent-dark' : ''}`}
        onPress={onPress}
      >
        <Ionicons name={icon} size={28} color={color} />
      </TouchableOpacity>
      <Text className="text-primary-dark dark:text-primary-light text-center font-pmedium">
        {label}
      </Text>
      {value && (
        <Text className="text-primary-dark dark:text-primary-light text-center text-sm">
          {value}
        </Text>
      )}
    </View>
  )
}

// Component for the care history graph
const CareHistoryGraph: React.FC<CareHistoryGraphProps> = ({ historyData, type }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const maxValue = Math.max(...historyData.map(item => item.value))
  
  return (
    <View className="mt-4">
      <Text className="text-primary-dark dark:text-primary-light font-pmedium mb-2">
        {type === 'water' ? 'Watering History' : type === 'light' ? 'Light Exposure' : 'Care History'}
      </Text>
      <View className="flex-row justify-between items-end h-[100px] bg-gray-100 dark:bg-black-200 rounded-xl p-2">
        {historyData.map((item, index) => {
          const barHeight = (item.value / maxValue) * 80
          const isToday = index === historyData.length - 1
          
          return (
            <View key={index} className="items-center flex-1">
              <View 
                style={{ height: Math.max(barHeight, 4) }} 
                className={`w-[6px] rounded-full ${
                  isToday 
                    ? 'bg-accent-light dark:bg-accent-dark' 
                    : item.value > 0 
                      ? 'bg-accent-light/60 dark:bg-accent-dark/60' 
                      : 'bg-gray-300 dark:bg-gray-700'
                }`} 
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default function PlantCareDetail() {
  const { slug } = useLocalSearchParams()
  const { plants, updatePlantDetails } = useUserPlants()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  
  const [plant, setPlant] = useState<Plant | null>(null)
  const [waterHistory, setWaterHistory] = useState<HistoryItem[]>([])
  const [lightHistory, setLightHistory] = useState<HistoryItem[]>([])
  const [lastWatered, setLastWatered] = useState<Date | null>(null)
  const [lastLightCheck, setLastLightCheck] = useState<Date | null>(null)
  const [waterLevel, setWaterLevel] = useState(100)
  const [lightLevel, setLightLevel] = useState('Sunny')
  const [humidityLevel, setHumidityLevel] = useState(130)

  // Find the plant by slug
  useEffect(() => {
    if (slug && plants.length > 0) {
      const foundPlant = plants.find(p => p.slug === slug)
      if (foundPlant) {
        setPlant(foundPlant)
        
        // Initialize care history
        const today = new Date()
        const waterHistoryData: HistoryItem[] = []
        const lightHistoryData: HistoryItem[] = []
        
        // Generate last 7 days of data
        for (let i = 6; i >= 0; i--) {
          const date = subDays(today, i)
          const dayLabel = i === 0 ? 'Today' : format(date, 'EEE')
          
          // Random values for demo purposes - in real app, this would come from stored data
          const wasWatered = Math.random() > 0.6
          waterHistoryData.push({
            date: format(date, 'yyyy-MM-dd'),
            value: wasWatered ? 1 : 0,
            label: dayLabel
          })
          
          const lightValue = Math.floor(Math.random() * 100)
          lightHistoryData.push({
            date: format(date, 'yyyy-MM-dd'),
            value: lightValue,
            label: dayLabel
          })
        }
        
        setWaterHistory(waterHistoryData)
        setLightHistory(lightHistoryData)
        
        // Set last watered date
        const lastWateredRecord = foundPlant.last_watered ? parseISO(foundPlant.last_watered) : null
        setLastWatered(lastWateredRecord)
        
        // Set light level if exists
        if (foundPlant.light_level) {
          setLightLevel(foundPlant.light_level)
        }
        
        // Set humidity level if exists
        if (foundPlant.humidity_level) {
          setHumidityLevel(foundPlant.humidity_level)
        }
      }
    }
  }, [slug, plants])

  // Handle watering the plant
  const handleWatering = () => {
    if (!plant) return
    
    const now = new Date().toISOString()
    updatePlantDetails(plant.id, { last_watered: now })
    setLastWatered(parseISO(now))
    
    // Update water history
    const updatedHistory = [...waterHistory]
    updatedHistory[updatedHistory.length - 1].value = 1
    setWaterHistory(updatedHistory)
  }

  // Handle light check
  const handleLightCheck = (level: string) => {
    if (!plant) return
    
    const now = new Date().toISOString()
    updatePlantDetails(plant.id, { light_level: level })
    setLastLightCheck(parseISO(now))
    setLightLevel(level)
  }

  // Handle humidity check
  const handleHumidityCheck = (level: number) => {
    if (!plant) return
    
    updatePlantDetails(plant.id, { humidity_level: level })
    setHumidityLevel(level)
  }

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark items-center justify-center">
        <Text className="text-primary-dark dark:text-primary-light">Loading plant details...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light">
            Plant Care
          </Text>
          <TouchableOpacity>
            <Ionicons 
              name="ellipsis-horizontal" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Plant Image and Name */}
        <View className="items-center mb-6">
          <View className="w-[78%] aspect-square bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden p-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
            {plant.image_url && (
              <Image
                source={{ uri: plant.image_url }}
                className="w-full h-full rounded-md"
                resizeMode="contain"
              />
            )}
          </View>
          <Text className="text-2xl font-pbold text-primary-dark dark:text-primary-light mt-4">
            {plant.name}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {plant.care_level} Care • Added {plant.added_at ? format(parseISO(plant.added_at), 'MMM d, yyyy') : 'Recently'}
          </Text>
        </View>
        
        {/* Care Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light mb-4">
            Care Actions
          </Text>
          <View className="flex-row justify-between">
            <CareActionButton 
              icon="water" 
              label="Water" 
              value={lastWatered ? `Last: ${format(lastWatered, 'MMM d')}` : 'Not yet'} 
              color="skyblue" 
              bgColor="bg-sky-500/20" 
              onPress={handleWatering}
              isActive={lastWatered ? format(lastWatered, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') : undefined}
            />
            <CareActionButton 
              icon="sunny" 
              label="Light" 
              value={lightLevel} 
              color="red" 
              bgColor="bg-red-500/20" 
              onPress={() => {
                const levels = ['Low', 'Medium', 'Sunny', 'Bright']
                const currentIndex = levels.indexOf(lightLevel)
                const nextIndex = (currentIndex + 1) % levels.length
                handleLightCheck(levels[nextIndex])
              }}
            />
            <CareActionButton 
              icon="thermometer-outline" 
              label="Humidity" 
              value={`${humidityLevel}%`} 
              color="green" 
              bgColor="bg-green-500/30" 
              onPress={() => {
                const levels = [50, 70, 90, 110, 130]
                const currentIndex = levels.indexOf(humidityLevel)
                const nextIndex = (currentIndex + 1) % levels.length
                handleHumidityCheck(levels[nextIndex])
              }}
            />
          </View>
        </View>
        
        {/* Care History */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light mb-2">
            Care History
          </Text>
          <View className="bg-white dark:bg-[#1b1b1d] rounded-xl p-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
            <CareHistoryGraph historyData={waterHistory} type="water" />
          </View>
        </View>
        
        {/* Care Tips */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-psemibold text-primary-dark dark:text-primary-light mb-2">
            Care Tips
          </Text>
          <View className="bg-white dark:bg-[#1b1b1d] rounded-xl p-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
            <View className="flex-row items-center mb-3">
              <View className="bg-sky-500/20 rounded-full p-2 mr-3">
                <Ionicons name="water" size={20} color="skyblue" />
              </View>
              <View className="flex-1">
                <Text className="text-primary-dark dark:text-primary-light font-pmedium">
                  Watering
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Water when top inch of soil is dry, typically every 7-10 days
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-3">
              <View className="bg-yellow-500/20 rounded-full p-2 mr-3">
                <Ionicons name="sunny" size={20} color="yellow" />
              </View>
              <View className="flex-1">
                <Text className="text-primary-dark dark:text-primary-light font-pmedium">
                  Light
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Prefers bright, indirect light. Avoid direct afternoon sun
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-green-500/60 rounded-full p-2 mr-3">
                <Ionicons name="thermometer-outline" size={20} color="yellow" />
              </View>
              <View className="flex-1">
                <Text className="text-primary-dark dark:text-primary-light font-pmedium">
                  Humidity
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Prefers moderate to high humidity. Mist occasionally
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
