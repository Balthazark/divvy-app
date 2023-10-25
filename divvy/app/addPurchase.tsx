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
  KeyboardAvoidingView,
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
  const [isPriceSet, setIsPrice] = useState<boolean>(false);
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
  }

  const handleSubmit = () => {
    if(!price || !title ||checkedItems.length < 1){
      return;
    }
    const docRef = doc(collection(db, "groups", groupId, "purchases"));
    const data = {
      createdAt: serverTimestamp(),
      createdBy: user,
      price: price,
      title: title,
      items: checkedItems.map((e) => e.id),
    };

    checkedItems.forEach((ref) => {
      setDoc(ref, { isBought: true, inPurchase: docRef.id,isChecked:true }, { merge: true });
    });

    setDoc(docRef, data);
    router.back();
  };

  return isPriceSet ? (
    <View className="h-full bg-white w-full justify-center items-center py-4">
      <TextInput
        onChange={(e) => setTitle(e.nativeEvent.text)}
        className="border-2 w-3/4 h-9 align-top rounded-xl border-slate-300 mb-5 p-2"
        placeholder="Title"
        textAlignVertical={"center"}
      />
      <Text className="font-normal text-lg">What items did you buy?</Text>
      <ScrollView className="w-full border-t border-slate-300 my-4">
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
        className="bg-blue-500 rounded-xl w-1/2 h-10 mb-10 items-center justify-center"
      >
        <Text className="text-white font-medium">Add Purchase</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={120}
      className="w-full bg-white flex-1 justify-between items-center"
    >
      <View className="flex-row items-center mt-40">
        <TextInput
          autoFocus={true}
          keyboardType="numeric"
          placeholder="Price"
          className="text-3xl"
          onChange={(e) => setPrice(parseInt(e.nativeEvent.text))}
        ></TextInput>
      </View>
      <View className="flex-1 max-h-10 w-full items-end jusify-center">
        <TouchableOpacity
          disabled={!price}
          onPress={() => setIsPrice(true)}
          className="bg-[#0782F9] py-2 px-5 rounded-lg items-center mr-5"
        >
          <Text className="text-white font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* 


/*

<View className="h-full bg-white w-full justify-center items-center py-4">
      <TextInput
        onChange={(e) => setTitle(e.nativeEvent.text)}
        className="border-2 w-3/4 h-12 text-base align-top rounded-xl border-slate-300 mb-5 p-2"
        placeholder="Title"
        textAlignVertical={'center'}
      />
      <Text className="font-bold text-lg">What items did you buy?</Text>
      <ScrollView className="w-full border-t border-slate-300 my-4">
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
  */

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
