import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { router } from "expo-router";

export default function CreateGroup() {
  const [user] = useAuthState(auth);
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async () => {
    if (groupName.length > 0) {
      const groupData = {
        groupName: groupName,
        users: [user?.uid],
      };
      const docRef = await addDoc(collection(db, "groups"), groupData);
      console.log("new group with id: " + docRef.id);
      router.replace('/');
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
          className="bg-white py-4 px-2 rounded-xl mt-1.5"
        />
      </View>

      <View className="w-3/4 mt-10">
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
