import React, { Component } from "react";
import { Text, View, Image, ImageSourcePropType } from "react-native";
import { Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from '@react-native-masked-view/masked-view';

import { icons } from "../../constants";

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  focused: boolean;
  name: string;
}
const CenterButton = () => {
  return (
    <View className="-mt-16 rounded-full shadow-[0px_10px_34px_8px_rgba(85,142,50,0.60)] items-center justify-center">
      <LinearGradient
        colors={["#9ff16d", "#558e32"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-10 h-10 rounded-full"
        style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, borderRadius: 50, width: 71, height: 71, alignItems: "center", justifyContent: "center" }}
      >
        <Image
          source={icons.scan}
          resizeMode="contain"
          tintColor="#FFFFFF"
          className="w-12 h-12"
        />
      </LinearGradient>
    </View>
  );
};
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
              style={{ tintColor: "#000000", width: 32, height: 32 }}
            />
          }
        >
          <LinearGradient
            colors={["#A6FB72", "#3B6C1E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
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
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#558e32",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            height: 112,
            borderTopWidth: 25,
            borderTopColor: "#FFFFFF",
            borderRadius: 18,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            shadowColor: "rgba(115,155,97,0.10)",
            shadowOffset: {
              width: 0,
              height: -10,
            },
            shadowOpacity: 1,
            shadowRadius: 19,
            elevation: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home2}
                color={color}
                focused={focused}
                name="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.explore}
                color={color}
                focused={focused}
                name="Explore"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="identify"
          options={{
            headerShown: false,
            tabBarIcon: () => <CenterButton />,
          }}
        />
        <Tabs.Screen
          name="care"
          options={{
            title: "Care",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.care}
                color={color}
                focused={focused}
                name="Care"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            // title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile1}
                color={color}
                focused={focused}
                name="Profile"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
