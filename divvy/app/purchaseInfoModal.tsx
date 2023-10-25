import { router, useLocalSearchParams } from "expo-router";
import {
  DocumentData,
  DocumentReference,
  collection,
  collectionGroup,
  doc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import { db } from "../config/firebase";
import { ActivityIndicator, View,Text,ScrollView } from "react-native";
import { Avatar } from "../components/Item";

export default function PurchaseInfo() {
  const params = useLocalSearchParams();
  const id = params.id as string;

  if (!id) return;

  const purchaseRef = collectionGroup(db, "purchases");
    const [purchases, loading, error] = useCollection(purchaseRef);
  const itemsCollection = collectionGroup(db, "Items");
  const q = query(
    itemsCollection,
    where("inPurchase", "==", id)
  );
  const [items, loadingI, errorI] = useCollection(q);

  if (loading || loadingI) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if(!items || !purchases) return;

  const purchase = purchases.docs.filter(e => e.id == id)[0]
  const date = purchase.data()?.createdAt.toDate().toString()

  return(
    <View className="w-full bg-white h-full flex-1 flex-col">
      <View className="w-full max-h-20 flex-1 flex-row justify-between px-4 items-center border-b border-slate-300">
        <Text>{purchase.data()?.price} kr</Text>
        <View className="pl-10"><Avatar userId={purchase?.data()?.createdBy} /></View>
        <Text>{date.slice(4,15)}</Text>
      </View>
      <ScrollView className="w-full mt-2">
      {items?.docs.map(item => (
        <View className="h-16 w-full flex-col px-2 my-1 pb-4 border-b border-slate-300">
        <Text className="font-medium text-base mb-2">{item.data().itemName}</Text>
        <Text>{item.data().inCategory}</Text>
      </View>
      ))}
    </ScrollView>
    </View>
  )
}
