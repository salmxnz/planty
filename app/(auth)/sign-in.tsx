import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { supabase } from '../../utils/supabase'
import { images } from "../../constants";
import { TouchableOpacity } from "react-native";
import { useAuth } from '@/context/AuthProvider'
const SignIn = () => {
  const { session } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect to home if session exists
  if (session) {
    return router.replace("/(tabs)/home");
  }

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
        <ScrollView>
          <View className="w-full min-h-full px-4 my-6">
            <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" />
            <Text className="text-black dark:text-white text-2xl font-psemibold mt-10">Log in to Planty</Text>
            <FormField 
              title="Email" 
              value={form.email} 
              handleChangeText={(value) => setForm({ ...form, email: value })} 
              placeholder="example@gmail.com" 
              otherStyles="mt-7" 
              keyboardType="email-address"
            />
            <FormField 
              title="Password" 
              value={form.password} 
              handleChangeText={(value) => setForm({ ...form, password: value })} 
              placeholder="Enter your password" 
              otherStyles="mt-7"
              secureTextEntry
            />
            <CustomButton
              title="Sign In"
              containerStyles={`bg-primary-dark dark:bg-primary-dark rounded-xl min-h-[62px] justify-center items-center px-4 mt-7 w-full`}
              handlePress={handleSignIn}
              textStyles="text-white font-psemibold text-pregular text-[18px]"
              isLoading={loading}
            />
            <View className="flex-row items-center justify-center mt-10">
              <Text className="text-black dark:text-white text-pregular text-base">Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/sign-up")}>
                <Text className="text-accent-light dark:text-accent-dark text-pregular text-base font-pmedium">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default SignIn;