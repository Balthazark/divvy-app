import { useLocalSearchParams } from "expo-router";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import { View, Text } from "react-native";
import { Avatar } from "../components/Item";
import { StatusBar } from "expo-status-bar";

export default function BalanceModal() {
  const params = useLocalSearchParams();
  const groupId = params.groupId as string;

  const purchaseRef = collection(db, "groups", groupId, "purchases");
  const [purchases, loading, error] = useCollection(purchaseRef);
  const groupRef = doc(db, "groups", groupId);
  const [group] = useDocumentData(groupRef);

  if (!group || !purchases) return;
  const totalAverageDebt =
    purchases.docs.reduce((a, p) => a + p.data().price, 0) /
    -group.users.length;
  const usersBalance = group.users.reduce(
    (a: any, v: any) => ({ ...a, [v]: totalAverageDebt }),
    {}
  );
  purchases.forEach(
    (d) =>
      (usersBalance[d.data().createdBy] =
        usersBalance[d.data().createdBy] + d.data().price)
  );
  const entries = Object.entries(usersBalance);
  return (
    <>
      <View className="w-full h-full flex-1 justify-start">
        {entries.map((e) => (
          //@ts-ignore
          <UserCard userId={e[0]} debt={e[1]} />
        ))}
      </View>
      <StatusBar style="light" />
    </>
  );
}

function UserCard(props: { userId: string; debt: number }) {
  const [user, loading, error] = useDocumentData(
    doc(db, "users", props.userId)
  );

  if (!user) return;

  const debtStyle = props.debt < 0 ? "#ee4b2b" : "#50c878";

  return (
    <View className="flex-1 flex-row w-full max-h-20 items-center justify-between px-4 bg-white border-b border-slate-300">
      <Avatar userId={props.userId}></Avatar>
      <Text className="font-medium text-base">
        {user.name} {user.lastName}
      </Text>
      <Text className="font-medium text-base" style={{ color: debtStyle }}>
        {props.debt.toFixed(2)} kr
      </Text>
    </View>
  );
}
