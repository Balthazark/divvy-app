import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TabView, TabBar } from "react-native-tab-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { collectionGroup, doc, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import Item, { Avatar } from "../components/Item";

interface GroupProps {
  id: string;
  name: string;
  users: string[];
}

const Header = (props: { userId: string }) => (
  <View className="mr-3 justify-center">
    <Avatar userId={props.userId} />
  </View>
);

const ShoppingList = (props: { groupId: string }) => {
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(allItemsCollection, where("inGroup", "==", props.groupId));
  const [allItems, loading2, error2] = useCollection(q);
  if (!allItems) return;

  return (
    <View className="flex-1 flex-col h-full w-full bg-white ">
      {allItems?.docs.map((e) => (
        <Item
          key={e.id}
          isBought={e.data().isBought}
          isChecked={e.data().isChecked}
          groupId={e.data().inGroup}
          ownedBy={e.data().ownedBy}
          id={e.id}
          name={e.data().itemName}
          inCategory={e.data().inCategory}
          disableAssign={false}
        />
      ))}
    </View>
  );
};

const MyItems = (props: { groupId: string }) => {
  const user = auth.currentUser?.uid as string;
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(
    allItemsCollection,
    where("inGroup", "==", props.groupId),
    where("ownedBy", "==", user)
  );
  const [allItems, loading2, error2] = useCollection(q);
  if (!allItems) return;

  return (
    <View className="flex-1 flex-col h-full w-full bg-white ">
      {allItems?.docs.map((e) => (
        <Item
          key={e.id}
          isBought={e.data().isBought}
          isChecked={e.data().isChecked}
          groupId={e.data().inGroup}
          ownedBy={e.data().ownedBy}
          id={e.id}
          name={e.data().itemName}
          inCategory={e.data().inCategory}
          disableAssign={false}
        />
      ))}
    </View>
  );
};

const renderScene = (route: any, groupId: string) => {
  switch (route.key) {
    case "shopping":
      return <ShoppingList groupId={groupId}></ShoppingList>;
    case "items":
      return <MyItems groupId={groupId}></MyItems>;
    case "purchases":
      return <ShoppingList groupId={groupId}></ShoppingList>;
  }
};

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "black" }}
    labelStyle={{ color: "black", fontSize: 12 }}
    activeColor="blue"
    className="bg-white text-black"
  />
);

export default function Group(props: GroupProps) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "shopping", title: "Shopping List" },
    { key: "items", title: "My Items" },
    { key: "purchases", title: "Purchases" },
  ]);

  const params = useLocalSearchParams();
  const groupId = params.groupId as string;
  if (!groupId) return;

  const groupRef = doc(db, "groups", groupId);
  const [group] = useDocumentData(groupRef);

  if (!group) return;

  return (
    <View className="flex-1">
      <ScrollView horizontal className="max-h-14 pl-3 flex-1 bg-white">
        {group.users.map((e: string) => (
          <Header key={e} userId={e} />
        ))}
      </ScrollView>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={(props: any) => renderScene(props.route, groupId)}
        onIndexChange={setIndex}
      />

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/addItem",
            params: { groupId: "AP8BX5jriOJ3PXiPOD48" },
          })
        }
        className="absolute bottom-10 rounded-full right-5 bg-black w-11 h-11 flex-1 justify-center items-center"
      >
        <FontAwesome name="plus" color="#FFFFFF" size={20} />
      </TouchableOpacity>
    </View>
  );
}
