import { doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { db } from "../config/firebase";
import { Avatar } from "../components/Item";
import { router, useLocalSearchParams } from "expo-router";

export default function AssignUserModal() {
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const itemPath = params.itemPath as string;
  const groupId = params.groupId as string;

  const groupRef = doc(db, "groups", groupId);
  const itemRef = doc(db, itemPath);
  const [group] = useDocumentData(groupRef);
  const [item] = useDocumentData(itemRef);

  if (!group && !item) return;

  const handleClick = (user: string) => {
    setDoc(itemRef, { ownedBy: user }, { merge: true });
    router.back();
  };

  return (
    <TouchableOpacity
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      className="w-full py-72 items-center flex-1"
      onPress={() => router.back()}
    >
      <Pressable className="bg-white flex-1 justify-center w-3/4 rounded-[20px]">
        <Header userId={userId} />
        <View className="flex-1 flex-row flex-wrap h-40 p-2 gap-2">
          {group?.users.map((e: string) => (
            <TouchableOpacity key={e} onPress={() => handleClick(e)}>
              <Avatar key={e} userId={e} />
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </TouchableOpacity>
  );
}

function Header(props: { userId: string }) {
  return (
    <View className="w-full border-b border-slate-300 max-h-20 flex-1 justify-center items-center">
      {props.userId === "none" || !props.userId ? null : (
        <Avatar userId={props.userId} />
      )}
      <Text>Assign new user</Text>
    </View>
  );
}
