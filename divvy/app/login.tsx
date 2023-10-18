import {
  Text,
  KeyboardAvoidingView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/");
      }
    });
    return unsubscribe;
  }, []);

    const handleSignIn = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in with:", userCredentials.user.email);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior="padding"
    >
      <View className="w-4/5">
        <TextInput
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-1.5"
        />

        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChange={(event) => setPassword(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-1.5"
        />
      </View>
      <View className="w-3/5 justify-center items-center mt-10">
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-[#0782F9] w-full p-2 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          className="bg-white border-[#0782F9] border-2 w-full p-2 rounded-xl items-center mt-1.5"
        >
          <Text className="text-[#0782F9] font-bold text-base">Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
