import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import {
    ScrollView,
    GestureHandlerRootView,
} from 'react-native-gesture-handler'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Redirect, router } from 'expo-router'
import { supabase } from '../../utils/supabase'
import { useAuth } from '@/context/AuthProvider'
import Loading from '@/components/Loading'
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useCallback } from 'react';

const SignUp = () => {
    const { session, isLoading } = useAuth()
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nameUser: '',
    })
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => true; // Prevents back action
          const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress
          );
      
          return () => subscription.remove();
        }, [])
      );
      

    // Use useEffect for navigation instead of redirecting during render
    // useEffect(() => {
    //   if (session && !isLoading) {
    //     router.replace("/(tabs)/home");
    //   }
    // }, [session, isLoading]);

    // If still loading auth state, show loading screen
    if (isLoading) {
        return <Loading />;
    }

    const handleSignUp = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        username: form.nameUser,
                    },
                },
            })

            if (error) throw error

            // Create profile
            if (data?.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        username: form.nameUser,
                        updated_at: new Date(),
                    })

                if (profileError) throw profileError
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="bg-primary-light dark:bg-primary-dark h-full">
            <GestureHandlerRootView>
                <ScrollView>
                    <View className="w-full min-h-full px-4 my-6 mt-20">
                        {/* <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" /> */}
                        <View className="text-center items-center space-y-1 ">
                            <Text className="text-accent-light dark:text-accent-dark text-4xl font-psemibold mb-3">
                                Register
                            </Text>
                            <Text className="text-black dark:text-white text-base font-pregular">
                                Create your account
                            </Text>
                        </View>
                        <FormField
                            imageIcon="account"
                            title="Name"
                            value={form.nameUser}
                            handleChangeText={(value) =>
                                setForm({ ...form, nameUser: value })
                            }
                            placeholder="John Doe"
                            otherStyles="mt-7"
                            keyboardType="default"
                        />
                        <FormField
                            imageIcon="email"
                            title="Email"
                            value={form.email}
                            handleChangeText={(value) =>
                                setForm({ ...form, email: value })
                            }
                            placeholder="example@gmail.com"
                            otherStyles="mt-6"
                            keyboardType="email-address"
                        />
                        <FormField
                            imageIcon="lock"
                            title="Password"
                            value={form.password}
                            handleChangeText={(value) =>
                                setForm({ ...form, password: value })
                            }
                            placeholder="Enter your password"
                            otherStyles="mt-6"
                            secureTextEntry
                        />
                        <FormField
                            imageIcon="lock"
                            title="Confirm Password"
                            value={form.confirmPassword}
                            handleChangeText={(value) =>
                                setForm({ ...form, confirmPassword: value })
                            }
                            placeholder="Confirm your password"
                            otherStyles="mt-6"
                            secureTextEntry
                        />
                        <View className="mt-6">
                            <CustomButton
                                title={loading ? 'Loading...' : 'Sign Up'}
                                handlePress={handleSignUp}
                                textStyles="text-white dark:text-primary-dark font-psemibold text-pregular text-[18px]"
                                containerStyles={`bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 mt-7 w-full`}
                                // disabled={
                                //     !form.email ||
                                //     !form.password ||
                                //     !form.confirmPassword ||
                                //     !form.nameUser ||
                                //     form.password !== form.confirmPassword ||
                                //     loading
                                // }
                            />
                        </View>
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-500 dark:text-gray-300 font-pregular">
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/sign-in')}
                            >
                                <Text className="text-accent-light dark:text-accent-dark font-psemibold">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default SignUp
