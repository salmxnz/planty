import { View, Text, Image} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

import { images } from "../../constants";
const SignIn = () => {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });


  return (
    <SafeAreaView className="bg-primary h-full">

      <GestureHandlerRootView>
      <ScrollView>
      <View className="w-full min-h-full px-4 my-6">
      <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" />
      <Text className="text-white text-2xl font-psemibold mt-10">Log in to Aora</Text>
      <FormField title="Email" value={form.email} handleChangeText={(value) => setForm({ ...form, email: value })} placeholder="Enter your email" otherStyles="mt-7" keyboardType="email-address"/>
      <FormField title="Password" value={form.password} handleChangeText={(value) => setForm({ ...form, password: value })} placeholder="Enter your password" otherStyles="mt-7"/>
      <CustomButton
          title="Home"
          containerStyles={`bg-secondary-200 rounded-xl min-h-[62px] justify-center items-center px-4 mt-7 w-full`}
          handlePress={() => router.push("/home")}
          textStyles="text-white font-psemibold text-pregular text-[18px]"
          isLoading={false}
        />
      </View>
      </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default SignIn;
