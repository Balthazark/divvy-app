import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { collection, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import GroupCard from "../../components/GroupCard";

export default function TabOneScreen() {
  const user = auth.currentUser;
  const groupRef = collection(db, "groups");

  const q = query(groupRef, where("users", "array-contains", user?.uid), orderBy("createdAt", "desc"));
  const [groups, loading, error] = useCollection(q);


  if (error) {
    console.log(error);

  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-start w-screen bg-white">
      <View className="w-3/4 mt-10">
        <TouchableOpacity
          onPress={() => router.push({pathname:'/group', params:{groupId:'AP8BX5jriOJ3PXiPOD48'}})}
          className=" w-full p-2 rounded-xl items-center border"
        >
          <Text className="text-black font-bold text-base">
            {" "}
            + Add new party &#129395;
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="py-5">
      <View className="flex-1 justify-center max-w-full ">
        {groups?.docs.map(g => <GroupCard key={g.id} doc={g} />)}
      </View>
      </ScrollView>
    </View>
  );
}
