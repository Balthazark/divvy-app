import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import GroupCard from "../GroupCard";

export default function TabOneScreen() {
  const [user] = useAuthState(auth);

  const groupRef = collection(db, "groups");
  const q = query(groupRef, where("users", "array-contains", user?.uid));
  const [groups, loading, error] = useCollection(q);

  console.log()

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
      <ScrollView className="my-5">
      <View className="flex-1 justify-center w-full ">
        {groups?.docs.map(g => <GroupCard key={g.id} doc={g} />)}
      </View>
      </ScrollView>
    </View>
  );
}
