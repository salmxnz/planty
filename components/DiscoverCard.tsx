import React, { useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'

interface Feature {
    id: number
    name: string
    img_url: string
}

interface DiscoverCardProps {
    feature: Feature
    onPress: () => void
}

export default function DiscoverCard({ feature, onPress }: DiscoverCardProps) {
    const [imageLoading, setImageLoading] = useState<boolean>(true)

    return (
        <TouchableOpacity onPress={onPress} className="w-[43vw] max-h-[70px] h-auto bg-white dark:bg-[#1b1b1d] rounded-[18px] overflow-hidden px-4 py-3 flex-row">
            <View className="w-[35%] h-[50px] max-h-[50px] rounded-xl">
                {imageLoading && (
                    <View className="w-[50px] h-[50px] rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                {feature?.img_url && (
                    <Image
                        source={{ uri: feature.img_url }}
                        className={`w-[50px] h-[50px] rounded-xl ${imageLoading ? 'absolute opacity-0' : ''}`}
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                )}
            </View>
            <View className="flex-1 justify-between items-center">
                <View className="ml-2 h-full justify-center">
                    <Text className="text-primary-dark dark:text-primary-light text-md font-psemibold">
                        {feature.name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
