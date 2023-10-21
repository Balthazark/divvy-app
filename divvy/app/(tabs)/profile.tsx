import { Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { Avatar } from "../../components/Item";
import { Friend } from "../../types/user";
import { FontAwesome } from "@expo/vector-icons";
import FriendList from "../../components/FriendList";

export default function LogoutScreen() {
  const user = auth.currentUser;
  const [value, loading, error] = useDocumentData(doc(db, "users", user!.uid));
  const hasFriendRequests = !(value?.friendRequests.length === 0);

  console.log("VALUE USERS", value);

  const handleFriendAccept = async (friendRequest: Friend) => {};

  const handleFriendDecline = async (friendRequest: Friend) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userDocRef, {
        friendRequests: arrayRemove(friendRequest),
      });
      console.log("FINISHED");
    } catch (error) {
      if (error instanceof Error) {
        console.log("ERROR", error);
        alert(error);
      }
    }
  };

  const handleSignout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const FriendRequests = () => {
    if (!hasFriendRequests) {
      return null;
    }
    return (
      <View className="flex-1 flex-row content-center px-4 max-h-20 items-center bg-white border-b border-slate-300">
        <View className="flex-1 flex-row items-center">
          {value?.friendRequests.map((friendRequest: Friend) => {
            return (
              <View
                className="flex-row items-center"
                key={friendRequest.userId}
              >
                <Avatar userId={friendRequest.userId} />
                <Text className="px-5 text-md">{friendRequest.email}</Text>
                <View className="flex-row-reverse items-center justify-end">
                  <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
                    <FontAwesome name="check" size={24} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFriendDecline(friendRequest)}
                    className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center ml-8 mr-3"
                  >
                    <FontAwesome name="times" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 items-start justify-start p-3">
      {!hasFriendRequests ? null : (
        <Text className="py-4">Friend requests</Text>
      )}
      <FriendRequests></FriendRequests>
      <Text className=" py-4">Friends</Text>
      <FriendList></FriendList>
      <TouchableOpacity
        onPress={() => router.push("/addFriendModal")}
        className="bg-white border-[#0782F9] border-2 w-80 p-2 rounded-xl items-center m-4 "
      >
        <Text className="text-[#0782F9] font-bold text-base">Add friends</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignout}
        className="bg-[#0782F9] w-80 p-2 rounded-xl items-center m-4 mt-auto"
      >
        <Text className="text-white font-bold text-base">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
