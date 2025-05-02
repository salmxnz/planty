import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import StatsCard from './StatsCard'

const PlantStatsDashboard = () => {
  return (
    <ScrollView className="flex-1">
      <View className="p-2 pt-4">
        <View className="flex-row items-center mb-4">
          <Text className="text-text-light dark:text-primary-light font-psemibold text-xl">Plant Summary</Text>
        </View>
        
        {/* Main Stats Card */}
        <View className="bg-primary-light dark:bg-black-200 rounded-2xl p-4 mb-4 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
          <Text className="text-text-light dark:text-primary-light font-pmedium text-center text-lg mb-2">Plant Health</Text>
          <View className="flex-row items-center mb-2">
            <View className="w-32 h-32 justify-center items-center">
              {/* Circle progress indicator */}
              <View className="w-full h-full rounded-full border-[15px] border-accent-light dark:border-accent-dark opacity-30 absolute" />
              <View 
                className="w-full h-full rounded-full border-[15px] border-accent-light dark:border-accent-dark absolute"
                style={{ 
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  transform: [{ rotateZ: '45deg' }]
                }}
              />
              <Ionicons name="arrow-forward" size={24} color="#9FF16D" style={{ transform: [{ rotateZ: '45deg' }] }} />
            </View>
            <View className="ml-7">
              <Text className="text-text-light dark:text-primary-light font-pbold text-lg">Growth</Text>
              <Text className="text-text-light dark:text-primary-light font-pbold text-3xl">78/100</Text>
              <Text className="text-text-light dark:text-primary-light font-pregular text-sm">points</Text>
            </View>
          </View>
        </View>
        
        {/* Stats Grid */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <StatsCard 
              title="Water Level" 
              value="87%" 
              iconName="water" 
              iconColor="#1E90FF" 
              iconBgColor="bg-blue-500/20" 
              description="Last watered 2 days ago"
            />
          </View>
          <View className="flex-1 ml-2">
            <StatsCard 
              title="Light" 
              value="6.2h" 
              iconName="sunny" 
              iconColor="#FFD700" 
              iconBgColor="bg-yellow-500/20"
              description="Daily average"
            />
          </View>
        </View>
        
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <StatsCard 
              title="Humidity" 
              value="65%" 
              iconName="water-outline" 
              iconColor="#9FF16D" 
              iconBgColor="bg-green-500/60"
              description="Optimal range"
            />
          </View>
          <View className="flex-1 ml-2">
            <StatsCard 
              title="Temperature" 
              value="24°C" 
              iconName="thermometer-outline" 
              iconColor="#FF6347" 
              iconBgColor="bg-red-500/20"
              description="Room temperature"
            />
          </View>
        </View>
        
        {/* Quick Tips Section */}
        <View className="mb-4 mt-2">
          <Text className="text-text-light dark:text-primary-light font-pbold text-xl mb-3">Quick Tips</Text>
          <View className="bg-primary-light dark:bg-black-100 rounded-2xl p-4 mb-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
            <View className="flex-row items-center mb-2">
              <View className="bg-accent-light dark:bg-accent-dark rounded-full p-2 mr-3">
                <Ionicons name="water" size={20} color="#fff" />
              </View>
              <Text className="text-text-light dark:text-primary-light font-pmedium text-base flex-1 px-2">Water your Monstera when top soil is dry</Text>
              <Ionicons name="chevron-forward" size={20} color="#fffffff" />
            </View>
            <Text className="text-gray-500 dark:text-gray-100 font-pregular text-sm">Recommended: Once every 7-10 days</Text>
          </View>
          <View className="bg-primary-light dark:bg-black-100 rounded-2xl p-4 mb-3 shadow-[5px_5px_9px_0px_rgba(0,0,0,0.16)] dark:shadow-[0px_0px_2px_0px_rgba(250,250,250,0.2)]">
            <View className="flex-row items-center mb-2">
              <View className="bg-secondary-light rounded-full p-2 mr-3">
                <Ionicons name="sunny" size={20} color="#fff" />
              </View>
              <Text className="text-text-light dark:text-primary-light font-pmedium text-base flex-1 px-2">Move Peace Lily away from direct sunlight</Text>
              <Ionicons name="chevron-forward" size={20} color="#fffffff" />
            </View>
            <Text className="text-gray-500 dark:text-gray-100 font-pregular text-sm">Bright indirect light is ideal</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default PlantStatsDashboard
