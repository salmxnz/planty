import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Loading = () => {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-primary-light dark:bg-primary-dark">
            <ActivityIndicator size="large" color="#3B6C1E" />
        </SafeAreaView>
    )
}

export default Loading
