import { Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { useDocumentData} from "react-firebase-hooks/firestore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Avatar } from "../../components/Item";
import { Friend } from "../../types/user";
import { FontAwesome } from "@expo/vector-icons";
import FriendList from "../../components/FriendList";

export default function LogoutScreen() {
  const user = auth.currentUser;
  const [value, loading, error] = useDocumentData(doc(db, "users", user!.uid));
  const hasFriendRequests = !(value?.friendRequests?.length === 0);

  const handleFriendAccept = async (friendRequest: Friend) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      const friendRef = doc(db,'users',friendRequest.userId)
      await updateDoc(userDocRef, {
        friends: arrayUnion(friendRequest),
      });
      await updateDoc(friendRef,{
        friends: arrayUnion({
          email: value!.email,
          lastName:value!.lastName,
          name: value!.name,
          userId: auth.currentUser!.uid
        })
      })
      await updateDoc(userDocRef, {
        friendRequests: arrayRemove(friendRequest),
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error);
      }
    }
  };

  const handleFriendDecline = async (friendRequest: Friend) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userDocRef, {
        friendRequests: arrayRemove(friendRequest),
      });
    } catch (error) {
      if (error instanceof Error) {
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

  const truncateEmail = (email: string) => {
    if (email.length <= 26) {
      return email;
    }
    return email.substring(0, 26) + "...";
  };

  const FriendRequests = () => {
    if (!hasFriendRequests) {
      return null;
    }
    return (
      <View className="bg-white">
        {value?.friendRequests?.map((friendRequest: Friend) => {
          return (
            <View
              className="flex-row items-center justify-between space-x-2 border-b border-slate-300 p-4 mx-auto"
              key={friendRequest.userId}
            >
              <Avatar userId={friendRequest.userId} />
              <View className="flex-grow">
                <Text className="text-md">
                  {truncateEmail(friendRequest.email)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleFriendAccept(friendRequest)}
                className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
              >
                <FontAwesome name="check" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFriendDecline(friendRequest)}
                className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
              >
                <FontAwesome name="times" size={24} color="black" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 justify-start p-3">
      {!hasFriendRequests ? null : (
        <Text className="py-4">Friend requests</Text>
      )}
      <FriendRequests></FriendRequests>
      <Text className=" py-4">Friends</Text>
      <FriendList interactive={false} onlySelectedFriends={false}></FriendList>
      <TouchableOpacity
        onPress={() => router.push("/addFriendModal")}
        className="bg-white border-[#0782F9] border-2 w-80 p-2 rounded-xl items-center m-4 self-center"
      >
        <Text className="text-[#0782F9] font-bold text-base">Add friends</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignout}
        className="bg-[#0782F9] w-80 p-2 rounded-xl items-center m-4 mt-auto self-center"
      >
        <Text className="text-white font-bold text-base">Sign out</Text>
      </TouchableOpacity>
      
    </View>
  );
}
