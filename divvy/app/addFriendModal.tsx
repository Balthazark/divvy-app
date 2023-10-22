import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { View, Text } from "react-native";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { UserMetaData } from "../types/user";
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { Avatar } from "../components/Item";
import { router } from "expo-router";

export default function addFriendModal() {
  const [searchParam, setSearchParam] = useState("");
  const user = auth.currentUser;
  const [userData, userLoading, userError] = useDocumentData(
    doc(db, "users", user!.uid)
  );
  const [value, loading, error] = useCollection(collection(db, "users"));

  const filteredUsers = value?.docs.filter((user) => {
    const { email } = user.data();
    return email?.toLowerCase().includes(searchParam.toLowerCase());
  });

  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;

  const handleFriendRequest = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        friendRequests: arrayUnion({
          userId: user!.uid,
          email: userData?.email,
          name: userData?.name,
          lastName: userData?.lastName,
        }),
      });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.log("ERROR", error);
        alert(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center w-full"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView>
        <TextInput
          placeholder="Search for user email"
          value={searchParam}
          onChange={(event) => setSearchParam(event.nativeEvent.text)}
          className="bg-white p-2 rounded-xl mt-4 mx-auto min-w-[90%]"
        ></TextInput>
        <View className="mt-8 bg-white border-b border-slate-300 rounded-xl">
          {filteredUsers?.length === 0 ? (
            <Text className="text-lg p-2">No users found</Text>
          ) : (
            filteredUsers?.map((user) => {
              const { email, name, lastName } = user.data() as UserMetaData;
              return (
                <View
                  className="flex-row items-center justify-between p-4 space-x-4"
                  key={user.id}
                >
                  <Avatar userId={user.id} />
                  <View className="flex-grow">
                    <Text className="text-md">{email}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleFriendRequest(user.id)}
                    className="bg-white border-[#0782F9] border-2 p-2 rounded-xl items-center"
                  >
                    <Text className="text-[#0782F9] font-bold text-base">
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </KeyboardAvoidingView>
  );
}
