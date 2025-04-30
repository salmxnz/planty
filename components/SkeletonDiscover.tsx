import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class SkeletonDiscover extends Component {
  render() {
    return (
      <View className="w-[42vw] max-h-[70px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden px-4 py-3 flex-row">
        <View className="w-[35%] h-[50px] max-h-[50px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <View className="flex-1 justify-between items-center">
          <View className="ml-2 h-full justify-center">
            <View className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
            <View className="h-4 w-20 mt-2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          </View>
        </View>
      </View>
    )
  }
}
