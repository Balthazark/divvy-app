import { deleteDoc, doc } from "firebase/firestore";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { db } from "../config/firebase";
import { router, useLocalSearchParams } from "expo-router";

export default function AssignUserModal() {
  const params = useLocalSearchParams();
  const itemPath = params.itemPath as string;

  const itemRef = doc(db, itemPath);

  const handleRemove = () => {
    deleteDoc(itemRef);
    router.back();
  };

  return (
    <TouchableOpacity
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      className="w-full py-[350px] items-center flex-1"
      onPress={() => router.back()}
    >
      <Pressable className="bg-white flex-1 justify-center w-3/4 rounded-[20px] content-between">
        <View className="w-full max-h-10 flex-1  items-center">
          <Text className="font-medium">
            Are you sure you want to remove item?
          </Text>
        </View>
        <View className="flex-1 pt-2 px-2 max-h-10 flex-row justify-evenly">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#0782F9] w-1/3 p-2 rounded-xl items-center"
          >
            <Text className="text-white">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemove()}
            className="bg-red-600 w-1/3 p-2 rounded-xl items-center"
          >
            <Text className="text-white">Remove</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </TouchableOpacity>
  );
}
