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
    const [passwordValidation, setPasswordValidation] = useState({
        hasMinLength: false,
        hasSpecialChar: false,
        isValid: false
    })
    const [emailValidation, setEmailValidation] = useState({
        isValid: false
    })
    const [passwordsMatch, setPasswordsMatch] = useState(false)
    
    // Check if all validations pass
    const isFormValid = form.nameUser.trim() !== '' && 
                       form.email.trim() !== '' && emailValidation.isValid && 
                       form.password.trim() !== '' && passwordValidation.isValid && 
                       form.confirmPassword.trim() !== '' && passwordsMatch

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
                <ScrollView contentContainerStyle={{ paddingVertical: 100, paddingBottom: 150}} showsVerticalScrollIndicator={false}>
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
                                otherStyles="mb-4"
                                keyboardType="default"
                                textContentType="username"
                            />
                            <FormField
                                imageIcon="email"
                                title="Email"
                                value={form.email}
                                handleChangeText={(value) => {
                                    setForm({ ...form, email: value });
                                    
                                    // Validate email format
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    setEmailValidation({
                                        isValid: emailRegex.test(value)
                                    });
                                }}
                                placeholder="example@gmail.com"
                                otherStyles={form.email.length > 0 ? 'mb-2' : 'mb-4'}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                            />
                            {form.email.length > 0 && (
                                <View className="mb-4">
                                    <Text className={`text-sm ${emailValidation.isValid ? 'text-green-500' : 'text-red-500'}`}>
                                        {emailValidation.isValid ? 
                                            '• Valid email format ✓' : 
                                            '• Must be a valid email (e.g., example@domain.com)'}
                                    </Text>
                                </View>
                            )}
                            <FormField
                                imageIcon="lock"
                                title="Password"
                                value={form.password}
                                handleChangeText={(value) => {
                                    // Update form state
                                    setForm({ ...form, password: value });
                                    
                                    // Validate password requirements
                                    const hasMinLength = value.length >= 8;
                                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                                    const isValid = hasMinLength && hasSpecialChar;
                                    
                                    // Update validation state
                                    setPasswordValidation({
                                        hasMinLength,
                                        hasSpecialChar,
                                        isValid
                                    });
                                }}
                                placeholder="Enter your password"
                                otherStyles={form.password.length > 0 ? 'mb-2' : 'mb-6'}
                                secureTextEntry
                                isPassword={true}
                                textContentType='password'
                            />
                            {form.password.length > 0 && (
                                <View className="mb-4">
                                    <Text className={`text-sm ${passwordValidation.hasMinLength ? 'text-green-500' : 'text-red-500'}`}>
                                        • Minimum 8 characters {passwordValidation.hasMinLength ? '✓' : ''}
                                    </Text>
                                    <Text className={`text-sm ${passwordValidation.hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>
                                        • At least one special character {passwordValidation.hasSpecialChar ? '✓' : ''}
                                    </Text>
                                    {passwordValidation.isValid && (
                                        <Text className="text-green-500 text-sm mt-1">Password meets all requirements</Text>
                                    )}
                                </View>
                            )}
                            <FormField
                                imageIcon="lock"
                                title="Confirm Password"
                                value={form.confirmPassword}
                                handleChangeText={(value) => {
                                    setForm({ ...form, confirmPassword: value });
                                    
                                    // Check if passwords match
                                    setPasswordsMatch(form.password === value && value !== '');
                                }}
                                placeholder="Confirm your password"
                                otherStyles={form.confirmPassword.length > 0 ? 'mb-2' : 'mb-6'}
                                secureTextEntry
                                isPassword={true}
                                textContentType='password'
                            />
                            {form.confirmPassword.length > 0 && (
                                <View className="mb-2">
                                    <Text className={`text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                        {passwordsMatch ? 
                                            '• Passwords match ✓' : 
                                            '• Passwords do not match'}
                                    </Text>
                                </View>
                            )}
                            <CustomButton
                                title={loading ? 'Loading...' : 'Register'}
                                handlePress={handleSignUp}
                                textStyles="text-white dark:text-primary-dark font-psemibold text-pregular text-[18px]"
                                containerStyles={`bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 mt-6 w-full`}
                                disabled={
                                    !isFormValid || loading
                                }
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
