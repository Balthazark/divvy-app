import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";

import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FriendList from "../components/FriendList";
import { router, useLocalSearchParams } from "expo-router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { selectedFriendsAtom } from "./createGroup";
import { db } from "../config/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function addGroupMemberToExistingGroupModal() {
  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;
  const params = useLocalSearchParams();
  const groupId = params.groupId as string;
  const [value, setValue] = useAtom(selectedFriendsAtom);
  const [group, loading, error] = useDocumentData(doc(db, "groups", groupId));

  const handleAddMemberToExistingGroup = async () => {
    try {
      const groupDocRef = doc(db, "groups", groupId);
      for (const userId of value) {
        await updateDoc(groupDocRef, {
          users: arrayUnion(userId),
        });
      }
      setValue([]);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        alert(error);
      }
    }
  };
  return (
    <View className="h-full w-full">
      <ScrollView>
        <View className="flex-1 items-center justify-start p-3">
          <FriendList
            interactive={true}
            onlySelectedFriends={false}
            membersToExclude={group?.users}
          ></FriendList>
        </View>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"}></StatusBar>
      </ScrollView>
      <View className="absolute bottom-10 w-full px-20">
        <TouchableOpacity
          onPress={() => handleAddMemberToExistingGroup()}
          className="bg-[#0782F9] p-3 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Add members</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}