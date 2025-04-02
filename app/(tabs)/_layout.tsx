import React, { Component } from 'react'
import { Text, View, Image, ImageSourcePropType } from 'react-native'
import { Tabs } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { useColorScheme } from 'react-native'

import { icons } from '../../constants/cameraIcon'

interface TabIconProps {
    icon: ImageSourcePropType
    color: string
    focused: boolean
    name: string
}
const CenterButton = () => {
    return (
        <View className="-mt-16 rounded-full shadow-[0px_10px_34px_8px_rgba(85,142,50,0.60)] items-center justify-center">
            <LinearGradient
                colors={['#9ff16d', '#558e32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-10 h-10 rounded-full"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    borderRadius: 50,
                    width: 71,
                    height: 71,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    source={require('../../assets/icons/scan.png')}
                    resizeMode="contain"
                    tintColor="#FFFFFF"
                    className="w-12 h-12"
                />
            </LinearGradient>
        </View>
    )
}
const TabIcon = ({ icon, color, focused, name }: TabIconProps) => {
    return (
        <View className="items-center justify-center gap-2 w-16">
            {focused ? (
                <MaskedView
                    maskElement={
                        <Image
                            source={icon}
                            resizeMode="contain"
                            className="w-8 h-8"
                            style={{
                                tintColor: '#000000',
                                width: 32,
                                height: 32,
                            }}
                        />
                    }
                >
                    <LinearGradient
                        colors={['#A6FB72', '#88CF5D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            width: 32,
                            height: 32,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                </MaskedView>
            ) : (
                <Image
                    source={icon}
                    resizeMode="contain"
                    tintColor={color}
                    // style={{width: 35, height: 35 }}
                    className="w-9 h-9"
                />
            )}
        </View>
    )
}

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: (props) => icons.index(props)
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: (props) => icons.explore(props)
                }}
            />
            <Tabs.Screen
                name="identify"
                options={{
                    title: 'Identify',
                    tabBarIcon: (props) => icons.takePhoto(props)
                }}
            />
            <Tabs.Screen
                name="plants"
                options={{
                    title: 'My Plants',
                    tabBarIcon: (props) => icons.plants(props)
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: (props) => icons.settings(props)
                }}
            />
        </Tabs>
    )
}
