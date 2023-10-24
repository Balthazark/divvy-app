import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { router } from "expo-router";
import { atom, useAtom } from "jotai";
import FriendList from "../components/FriendList";

export const selectedFriendsAtom = atom<string[]>([]);

export default function CreateGroup() {
  const [user] = useAuthState(auth);
  const [groupName, setGroupName] = useState("");

  const [value, setValue] = useAtom(selectedFriendsAtom);

  const handleSubmit = async () => {
    if (groupName.length > 0) {
      const groupData = {
        groupName: groupName,
        users: [user?.uid, ...value],
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "groups"), groupData);
      console.log("new group with id: " + docRef.id);
      setValue([]);
      router.replace("/");
    } else {
      alert("No group name");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior="padding"
    >
      <View className="w-4/5">
        <TextInput
          placeholder="Name your party"
          value={groupName}
          onChange={(event) => setGroupName(event.nativeEvent.text)}
          className="bg-white py-4 px-2 rounded-xl mb-4"
        />
        <FriendList interactive={true} onlySelectedFriends={true}></FriendList>
      </View>

      <View className="w-3/4 mt-8 space-y-4">
        <TouchableOpacity
          onPress={() => router.push("/addGroupMemberModal")}
          className="bg-[#0782F9] p-2 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">+ Add members</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className=" w-full p-2 rounded-xl items-center border"
        >
          <Text className="text-black font-bold text-base">
            {" "}
            + Add new party &#129395;
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
