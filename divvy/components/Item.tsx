import { useDocumentData } from "react-firebase-hooks/firestore";
import { View, Text, TouchableOpacity } from "react-native";

import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { router } from "expo-router";

type ItemProps = {
  id: string | undefined;
  name: string;
  isChecked: boolean;
  isBought: boolean;
  ownedBy: string;
  groupId: string;
  inCategory: string;
  disableAssign: boolean;
};

export default function Item(props: ItemProps) {
  //@ts-ignore
  const docRef = doc(
    db,
    "groups",
    props.groupId,
    "categories",
    props.inCategory,
    "Items",
    props.id
  );

  const [checkboxValue, loading, error] = useDocumentData(docRef);
  const [isChecked, setChecked] = useState<boolean>();
  useEffect(() => {
    setChecked(checkboxValue?.isChecked);
  }, [checkboxValue]);

  const handleCheck = (value: boolean) => {
    setDoc(docRef, { isChecked: value }, { merge: true });
    setChecked(value);
  };

  if (props.isBought) {
    return (
      <View className="flex-1 flex-row content-center px-4 justify-between max-h-20 items-center bg-gray-200 border-b border-slate-300">
        <View className="flex-1 flex-row items-center">
          <Avatar userId={props.ownedBy} />
          <Text className="mx-5 text-lg">{props.name}</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={() =>
        router.push({
          pathname: "/removeItemModal",
          params: {
            itemPath: docRef.path,
          },
        })
      }
      className="flex-1 flex-row content-center px-4 justify-between max-h-20 items-center bg-white border-b border-slate-300"
    >
      <View className="flex-1 flex-row items-center">
        {props.disableAssign ? (
          <Avatar userId={props.ownedBy} />
        ) : (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/assignUserModal",
                params: {
                  itemPath: docRef.path,
                  userId: props.ownedBy,
                  groupId: props.groupId,
                },
              })
            }
          >
            <Avatar userId={props.ownedBy} />
          </TouchableOpacity>
        )}
        <Text className="py-5 mx-5 text-lg">{props.name}</Text>
      </View>
      <Checkbox
        value={isChecked}
        onValueChange={handleCheck}
        className="justify-self-end"
      />
    </TouchableOpacity>
  );
}

export function Avatar(props: { userId: string }) {
  const [user, loading, error] = useDocumentData(
    doc(db, "users", props.userId)
  );

  if (!user) {
    return (
      <View className="w-10 h-10 bg-gray-300 rounded-full justify-center items-center">
        <Text>+</Text>
      </View>
    );
  }

  return (
    <View
      style={{ backgroundColor: `${user.color}` }}
      className="w-10 h-10 rounded-full justify-center items-center"
    >
      <Text className="text-gray-700">
        {user.name.slice(0, 1)}
        {user.lastName.slice(0, 1)}
      </Text>
    </View>
  );
}
