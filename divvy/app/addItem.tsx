import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
    }

    router.back();
  };

  return (
    <View className="w-full">
      <TextInput
        className="text-black h-10"
        onChange={(event) => setItem(event.nativeEvent.text)}
        placeholder="Item"
      ></TextInput>
      {value === "add" ? (
        <TextInput
          onChange={(event) => setCategory(event.nativeEvent.text)}
          placeholder="New category"
        ></TextInput>
      ) : null}
      <View className="w-3/4">
        <DropDownPicker
          open={open}
          items={dataset}
          value={value}
          setOpen={setOpen}
          setValue={setValue}
          textStyle={{ color: "black" }}
          labelStyle={{ color: "black" }}
          style={{ borderColor: "gray" }}
        />
      </View>
      <TouchableOpacity className="h-20 my-20" onPress={handleSubmit}>
        <Text>Add item</Text>
      </TouchableOpacity>
    </View>
  );
}
