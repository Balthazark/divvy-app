import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function TabOneScreen() {
  const [user] = useAuthState(auth);

  const groupRef = collection(db, "groups");
  const q = query(groupRef, where("users", "array-contains", user?.uid));
  const [groups, loading, error] = useCollectionData(q);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-start">
      <View className="w-3/4 mt-10">
        <TouchableOpacity
          onPress={() => router.push("/createGroup")}
          className=" w-full p-2 rounded-xl items-center border"
        >
          <Text className="text-black font-bold text-base">
            {" "}
            + Add new party &#129395;
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center h-full">
        {groups?.map((group) => (
          /*REVEIW: Better key here, groupName might not always be unique */
          <Text key={group.groupName}>Group {group.groupName} </Text>
        ))}
      </View>
    </View>
  );
}
