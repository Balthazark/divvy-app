import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "react-native";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { UserMetaData } from "../types/user";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const colorList = ["#C1E7E3", "#DCFFFB", "#FFDCF4", "#DABFBE", "#C1BBDD"];

  const handleUserMetaData = async (userId: string) => {
    try {
      const colorNum = Math.floor(Math.random() * 4);

      const userMetaData: UserMetaData = {
        name: name,
        lastName: lastName,
        email: email,
        color: colorList[colorNum],
        friends: [],
        friendsRequests: []
      };
      await setDoc(doc(db, "users", userId), userMetaData);
      console.log("added user meta data ");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleSignup = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registered with:", userCredentials.user.email);
      await handleUserMetaData(userCredentials.user.uid);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View className="w-4/5">
        <TextInput
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-1"
        />

        <TextInput
          placeholder="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-3"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-3"
        />

        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChange={(event) => setPassword(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mt-3"
        />
      </View>
      <View className="w-3/5 justify-center items-center mt-10">
        <TouchableOpacity
          onPress={handleSignup}
          className="bg-[#0782F9] w-full p-2 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Register</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </KeyboardAvoidingView>
  );
}
