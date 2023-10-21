import { View, Text } from "react-native";
import { auth, db } from "../config/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { Friend } from "../types/user";
import { Avatar } from "./Item";

export default function FriendList() {
  const user = auth.currentUser;
  const [value, loading, error] = useDocumentData(doc(db, "users", user!.uid));

  if (value?.friends.length === 0) {
    return <Text>You have not added any friends yet!</Text>;
  }

  return (
    <View className="flex-1 flex-row content-center px-4 max-h-20 items-center bg-white border-b border-slate-300">
      <View className="flex-1 flex-row items-center">
        {value?.friends.map((friend: Friend) => {
          return (
            <View className="flex-row items-center" key={friend.userId}>
              <Avatar userId={friend.userId} />
              <Text className="px-5 text-md">{friend.email}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
