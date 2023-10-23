import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddItem() {
  const params = useLocalSearchParams();
  const user = auth.currentUser?.uid;
  const groupId = params?.groupId as string;
  if (!groupId) return;

  const catCollection = collection(db, "groups", groupId, "categories");
  const [categories] = useCollection(catCollection);
  const groupRef = doc(db, "groups", groupId);
  const [group] = useDocument(groupRef);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [newCategory, setCategory] = useState<string>();
  const [itemName, setItem] = useState<string>();

  if (!categories) return;

  const dataset = categories.docs.map((e) => ({ label: e.id, value: e.id }));
  dataset.push({ label: "Add new category", value: "add" });

  const handleSubmit = () => {
    if (value === null) return;
    if (value == "add" && newCategory && itemName) {
      const categorieRef = doc(db,'groups',groupId,'categories',newCategory)
      setDoc(categorieRef,{})

      const docRef = doc(
        collection(db, "groups", groupId, "categories", newCategory, "Items")
      );

      const data = {
        createdBy: user,
        groupName: group?.data()?.groupName,
        inCategory: newCategory,
        inGroup: groupId,
        isBought: false,
        isChecked: false,
        itemName: itemName,
        ownedBy: "none",
        created: serverTimestamp(),
      };
      setDoc(docRef, data);
      console.log("add item");
      router.back();
    }
    if (value !== "add" && itemName) {
      const docRef = doc(
        collection(db, "groups", groupId, "categories", value, "Items")
      );

      const data = {
        createdBy: user,
        groupName: group?.data()?.groupName,
        inCategory: value,
        inGroup: groupId,
        isBought: false,
        isChecked: false,
        itemName: itemName,
        ownedBy: "none",
        created: serverTimestamp(),
      };
      setDoc(docRef, data);
      console.log("add item");

      router.back();
    }

  };

  return (
    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={90} className="w-full flex-1 items-center justify-between bg-white p-4">
      <View className="w-full">
      <TextInput
        className="border-2 w-full h-8 rounded-xl border-slate-300 mb-5 p-2"
        onChange={(event) => setItem(event.nativeEvent.text)}
        placeholder="Item name"
      ></TextInput>
      <View className="w-full h-20 flex-row">
      {value === "add" ? (
        <TextInput
          onChange={(event) => setCategory(event.nativeEvent.text)}
          placeholder="New category"
          className="border-2 w-1/2 h-12 rounded-xl border-slate-300 mb-5 p-2"
        ></TextInput>
      ) : null}
        <DropDownPicker
          open={open}
          items={dataset}
          value={value}
          setOpen={setOpen}
          setValue={setValue}
          placeholder="Choose category"
          textStyle={{ color: "black" }}
          labelStyle={{ color: "gary" }}
          maxHeight={200}
          dropDownContainerStyle={{borderColor: "rgb(203 213 225)",width:'50%', borderWidth:2,}}
          containerStyle={{borderColor: "rgb(203 213 225)"}}
          style={{ borderColor: "rgb(203 213 225)",width:'50%', height:8,borderWidth:2,borderRadius:12,zIndex:9999}}
        />
      </View>
      </View>
      <TouchableOpacity className="bg-[#0782F9] w-1/2 p-2 rounded-xl justify-self-end items-center mb-10"onPress={handleSubmit}>
        <Text className="text-white font-bold text-base">Add item</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
