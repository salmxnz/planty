import React, { Component } from 'react'
import { View } from 'react-native'

export default class SkeletonPlant extends Component {
  render() {
    return (
      <View className="w-[50vw] max-h-[300px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden px-4 pt-4">
        <View className="w-full h-[22vh] max-h-[180px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <View className="mt-5 flex-row justify-between items-start">
          <View className="mt-5 flex-1 mr-2">
            <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
            <View className="h-4 w-20 mt-2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          </View>
          <View className="mt-2">
            <View className="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          </View>
        </View>
      </View>
    )
  }
}
