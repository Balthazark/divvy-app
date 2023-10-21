import { DocumentData, QueryDocumentSnapshot, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { View, Text, TouchableOpacity } from "react-native";
import { db, auth } from "../config/firebase";
import { router } from "expo-router";

interface GroupCardProps {
  doc: DocumentData;
}

export default function GroupCard(props: GroupCardProps) {
  const docId = props.doc.id;
  const docData = props.doc.data();
  const user = auth.currentUser?.uid;

  return (
    <TouchableOpacity onPress={() => router.push({pathname:'/group',params:{groupId:docId,title:docData.groupName}})}>
      <View className="mx-5 rounded-md shadow-md bg-white  my-2 justify-between p-4">
        <Text className="text-lg font-bold">{docData.groupName}</Text>
        <View className="flex-row w-full justify-between mt-5 items-center">
          <View className="flex-row">
            <Avatar key={user} isFirst={true} userId={user} />
            {docData.users
              ?.filter((e: string) => e !== user)
              .map((e: string) => (
                <Avatar key={e} isFirst={false} userId={e} />
              ))}
          </View>
          <Text>15/36 item</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface AvatarProp {
  userId: string | any;
  isFirst: boolean;
}

function Avatar(props: AvatarProp) {
  const [user, loading, error] = useDocumentData(
    doc(db, "users", props.userId)
  );

  console.log(user, "USERS");

  return (
    <View
      style={{ backgroundColor: `${user?.color}` }}
      className={`${
        props.isFirst ? "" : "-left-3"
      } w-10 h-10 rounded-full border-2 border-white justify-center items-center`}
    >
      <Text className="text-gray-700">
        {user?.name.slice(0, 1)}
        {user?.lastName.slice(0, 1)}
      </Text>
    </View>
  );
}
