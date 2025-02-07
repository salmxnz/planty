import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../constants'

const SphereButton = () => {
    return (
      <View className="rounded-full">
        <LinearGradient
          colors={["#9ff16d", "#558e32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-9 h-9 rounded-full"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, borderRadius: 50, width: 35, height: 35 , alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={icons.rightarrow}
            resizeMode="contain"
            tintColor="#FFFFFF"
            className="w-8 h-8"
          />
        </LinearGradient>
      </View>
    );
  };

export default SphereButton
