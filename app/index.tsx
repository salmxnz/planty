import {
    Text,
    View,
    Image,
    useWindowDimensions
} from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { Redirect, router } from 'expo-router'
import { images } from '../constants'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/context/AuthProvider'
import { moderateScale } from 'react-native-size-matters'
import { useEffect } from 'react'
import Loading from '@/components/Loading'

export default function Index() {
    const { session, isLoading } = useAuth()

    // Use useEffect for navigation instead of redirecting during render
    useEffect(() => {
        if (session && !isLoading) {
            router.replace("/(tabs)/home");
        }
    }, [session, isLoading]);

    // If still loading, show loading screen
    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView
            className="flex-1 light:bg-primary-light dark:bg-primary-dark"
            edges={['bottom']}
        >
            <GestureHandlerRootView className="flex-1">
                {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
                <OnboardingImage />
                <View className="w-full h-full justify-end pb-24 px-4">
                    <View className="">
                        <View className="relative">
                            <Text
                                className="text-white dark:text-white text-center font-pbold"
                                style={{
                                    fontSize: moderateScale(32),
                                    lineHeight: moderateScale(35),
                                }}
                            >
                                Plant a tree{' '}
                                <Text className="text-accent-light dark:text-accent-dark">
                                    &
                                </Text>
                            </Text>
                            <Text
                                className="text-white dark:text-white text-center font-pbold"
                                style={{
                                    fontSize: moderateScale(28),
                                    lineHeight: moderateScale(35),
                                }}
                            >
                                grow your community
                            </Text>
                            <Text
                                className="text-gray-200 mt-4 mb-6 opacity-80 text-center font-pmedium"
                                style={{
                                    fontSize: moderateScale(14),
                                    lineHeight: moderateScale(18),
                                }}
                            >
                                Where creativity meets creation: embark on a
                                journey with limitless possibilities.
                            </Text>
                        </View>
                        <CustomButton
                            title="Get Started"
                            containerStyles="bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 w-full"
                            handlePress={() => router.push('/sign-in')}
                            textStyles="text-white dark:text-black font-psemibold text-pregular text-[18px]"
                            isLoading={false}
                        />
                    </View>
                </View>
                {/* </ScrollView> */}
                <StatusBar style="dark" backgroundColor="#161622" />
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export function OnboardingImage(){
  const { width, height } = useWindowDimensions();

  return (
    <View className="absolute inset-0">
      {/* Background Image */}
      <Image
        source={images.onboarding_bg}
        style={{ width, height }}
        resizeMode="cover"
      />
      
      {/* Foreground Vector Image */}
      <Image
        source={images.vector_onboarding}
        style={{
          width: width * 1, 
          height: height * 0.7,
          // aspectRatio: 0.001, 
          position: "absolute",
          bottom: -height * 0.1, // Adjust based on screen size
          left: "50%",
          transform: [{ translateX: -width * 0.5 }], // Centered
        }}
        resizeMode="cover"
      />
    </View>
  );
}