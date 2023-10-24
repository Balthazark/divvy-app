import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";

import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FriendList from "../components/FriendList";
import { router } from "expo-router";

export default function addGroupMemberModal() {
  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;

  return (
    <View className="h-full w-full">
      <ScrollView>
        <View className="flex-1 items-center justify-start p-3">
          <FriendList
            interactive={true}
            onlySelectedFriends={false}
          ></FriendList>
        </View>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"}></StatusBar>
      </ScrollView>
      <View className="absolute bottom-10 w-full px-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#0782F9] p-3 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">
            + Select members
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
