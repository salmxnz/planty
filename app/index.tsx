import {
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
  Image,
  FlatListComponent,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/context/AuthProvider";

export default function Index() {
  const { session } = useAuth();

  // Redirect to home if session exists
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  } 

  return (
    <SafeAreaView className="flex-1 light:bg-primary-light dark:bg-primary-dark" edges={['bottom']}>
      <GestureHandlerRootView className="flex-1">
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
          <View className="absolute inset-0">
            <Image
              source={images.onboarding_bg}
              className="w-full h-full absolute"
              resizeMode="cover"
            />
            <Image
              source={images.vector_onboarding}
              className="w-[52vh] h-[60vh] absolute -bottom-12 left-[55%] -translate-x-1/2"
              resizeMode="cover"
            />
          </View>
          <View className="w-full h-full justify-end pb-24 px-4">
            <View className="">
              <View className="relative">
                <View className="flex flex-col items-center">
                  <Text className="text-white dark:text-white text-center font-pbold text-5xl leading-[60px] pt-2 flex-row items-center">
                    Plant a tree{" "}
                    <Text className="text-accent-light dark:text-accent-dark">
                      &
                    </Text>
                  </Text>
                  <Text className="text-white dark:text-white text-center font-pbold text-4xl pt-1">
                    grow your community
                  </Text>
                </View>
              </View>
              <Text className="text-gray-200 opacity-80 text-center font-pmedium text-[18px] pt-4 pb-6">
                Where creativity meets creation: embark on a journey with
                limitless possibilities.
              </Text>
              <CustomButton
                title="Get Started"
                containerStyles="bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 w-full"
                handlePress={() => router.push("/sign-in")}
                textStyles="text-white dark:text-black font-psemibold text-pregular text-[18px]"
                isLoading={false}
              />
            </View>
          </View>
        {/* </ScrollView> */}

        <StatusBar style="dark" backgroundColor="#161622" />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
