import { router, useLocalSearchParams } from "expo-router";
import { auth, db } from "../config/firebase";
import {
  DocumentReference,
  collection,
  collectionGroup,
  doc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { ScrollView } from "react-native-gesture-handler";

export default function AddPurchase() {
  const params = useLocalSearchParams();
  const user = auth.currentUser?.uid;
  const groupId = params?.groupId as string;
  console.log(groupId);
  if (!groupId) return;

  const [checkedItems, setItems] = useState<DocumentReference[]>([]);
  const [price, setPrice] = useState<number>();
  const [title, setTitle] = useState<string>();
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(
    allItemsCollection,
    where("inGroup", "==", groupId),
    where("ownedBy", "==", user),
    where("isBought", "==", false)
  );
  const [allItems, loading, error] = useCollection(q);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!allItems) return;

  function refHandler(docRef: DocumentReference) {
    const refs = checkedItems;
    const refIndex = refs.indexOf(docRef);
    if (refIndex > -1) {
      refs.splice(refIndex, 1);
    } else refs.push(docRef);

    setItems(refs);
    console.log(!price);
    console.log(!title)
    console.log("refs", checkedItems);
  }

  const handleSubmit = () => {
    const docRef = doc(
        collection(db, "groups", groupId,'purchases')
    );
    const data = {
        createdAt: serverTimestamp(),
        createdBy: user,
        price: price,
        title:title,
        items: checkedItems.map(e => e.id)
    }

    checkedItems.forEach(ref => {
        setDoc(ref,{isBought:true,inPurchase:docRef.id},{merge:true})
    })

    setDoc(docRef,data);
    router.back()
  };

  return (
    <View className="h-full bg-white w-full justify-center items-center">
      <TextInput
        keyboardType="numeric"
        onChange={(e) => setPrice(parseInt(e.nativeEvent.text))}
        className="border-2 w-1/2 h-8 rounded-xl border-slate-300 mb-5 p-2"
        placeholder="Price"
      >
        Price
      </TextInput>
      <TextInput
        onChange={(e) => setTitle(e.nativeEvent.text)}
        className="border-2 w-1/2 h-8 rounded-xl border-slate-300 mb-5 p-2"
        placeholder="Price"
      >
        Price
      </TextInput>
      <ScrollView className="w-full border-t border-slate-300">
        {allItems.docs.map((d) => (
          <ItemsCard
            key={d.id}
            item={d.data().itemName}
            category={d.data().inCategory}
            docRef={d.ref}
            setItem={refHandler}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
      onPress={() => handleSubmit()}
        disabled={checkedItems.length < 1 || !price || !title}
        className="bg-blue-500 rounded-xl w-1/2 h-10 mb-10 items-center justify-center"
      >
        <Text className="text-white font-medium">Add Purchase</Text>
      </TouchableOpacity>
    </View>
  );
}

function ItemsCard(props: {
  item: string;
  category: string;
  docRef: DocumentReference;
  setItem: (docRef: DocumentReference) => void;
}) {
  const [isChecked, setChecked] = useState(false);

  const handleCheck = (value: boolean) => {
    props.setItem(props.docRef);
    setChecked(value);
  };

  return (
    <View className="flex-1 flex-row bg-white border-b max-h-14 border-slate-300 items-center p-5">
      <View className="flex-1 gap-2">
        <Text className="font-bold">{props.item}</Text>
        <Text>{props.category}</Text>
      </View>
      <Checkbox
        value={isChecked}
        onValueChange={handleCheck}
        className="justify-self-end"
      />
    </View>
  );
}
