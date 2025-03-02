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
        <SafeAreaView className="bg-primary-light dark:bg-primary-dark flex-1">
            <GestureHandlerRootView className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="flex-1 justify-center items-center px-6">
                        {/* <Image source={images.logo} className="w-[115px] h-[35px] self-center mb-8" resizeMode="contain" /> */}
                        <View className="w-full max-w-md">
                            <View className="items-center space-y-1 mb-8">
                                <Text className="text-accent-light dark:text-accent-dark text-4xl font-psemibold mb-2">
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
                                otherStyles="mb-5"
                                keyboardType="default"
                                textContentType="username"
                            />
                            <FormField
                                imageIcon="email"
                                title="Email"
                                value={form.email}
                                handleChangeText={(value) =>
                                    setForm({ ...form, email: value })
                                }
                                placeholder="example@gmail.com"
                                otherStyles="mb-5"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                            />
                            <FormField
                                imageIcon="lock"
                                title="Password"
                                value={form.password}
                                handleChangeText={(value) =>
                                    setForm({ ...form, password: value })
                                }
                                placeholder="Enter your password"
                                otherStyles="mb-5"
                                secureTextEntry
                                isPassword={true}
                                textContentType='password'
                            />
                            <FormField
                                imageIcon="lock"
                                title="Confirm Password"
                                value={form.confirmPassword}
                                handleChangeText={(value) =>
                                    setForm({ ...form, confirmPassword: value })
                                }
                                placeholder="Confirm your password"
                                otherStyles="mb-6"
                                secureTextEntry
                                isPassword={true}
                                textContentType='password'
                            />
                            <CustomButton
                                title={loading ? 'Loading...' : 'Register'}
                                handlePress={handleSignUp}
                                textStyles="text-white dark:text-primary-dark font-psemibold text-pregular text-[18px]"
                                containerStyles={`bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 w-full`}
                                // disabled={
                                //     !form.email ||
                                //     !form.password ||
                                //     !form.confirmPassword ||
                                //     !form.nameUser ||
                                //     form.password !== form.confirmPassword ||
                                //     loading
                                // }
                            />
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-500 dark:text-gray-300 font-pregular">
                                    Already have an account?{' '}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/(auth)/sign-in')}
                                >
                                    <Text className="text-accent-light dark:text-accent-dark font-psemibold">
                                        Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </GestureHandlerRootView>
            <StatusBar style="light" backgroundColor="#161622" />
        </SafeAreaView>
    )
}

export default SignUp
