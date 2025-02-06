import { Text, TouchableOpacity, View, ImageSourcePropType, Image, FlatListComponent} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView} from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router"; 
import {images}  from "../constants";
import CustomButton from "@/components/CustomButton";


export default function Index() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full min-h-[85vh] items-center justify-center px-4">
        <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode="contain" />
        <Image source={images.cards} className="max-w-[380px] h-[300px] w-full" resizeMode="contain" ></Image>
        
        <View className="relative mt-5"> 
          <Text className="text-white text-center font-pbold text-3xl">Discover Endless possibilities with
          <Text className="text-secondary-200"> Aora</Text>
          </Text>
        <Image source={images.path} className="w-[136px] h-[15px] absolute -bottom-2 -right-9" resizeMode="contain" ></Image>
        </View>
        <Text className="text-gray-100 mt-7 text-center font-pregular">Where creativity meets creation: embark on a journey with limitless exploration</Text>
        <CustomButton
          title="Get Started"
          containerStyles={`bg-secondary-200 rounded-xl min-h-[62px] justify-center items-center px-4 mt-7 w-full`}
          handlePress={() => router.push("/sign-in")}
          textStyles="text-white font-psemibold text-pregular text-[18px]"
          isLoading={false}
        />
        </View>
      </ScrollView>

      <StatusBar style="light" backgroundColor="#161622" />

      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
