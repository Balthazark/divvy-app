import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TabView, TabBar } from "react-native-tab-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Href, router, useLocalSearchParams } from "expo-router";
import {
  collection,
  collectionGroup,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
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

const AddButton = (props: { pathname: string; groupId: string }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: props.pathname as Href<string>,
        params: { groupId: props.groupId },
      })
    }
    className="absolute bottom-10 rounded-full right-5 bg-[#0782F9] w-16 h-16 flex-1 justify-center items-center"
  >
    <FontAwesome name="plus" color="#FFFFFF" size={20} />
  </TouchableOpacity>
);

const AddMemberButton = (props: { groupId: string }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: "/addGroupMemberToExistingGroup",
        params: { groupId: props.groupId },
      })
    }
    className="w-10 h-10 mt-2 bg-gray-200 rounded-full justify-center items-center"
  >
    <Text className="text-lg font-bold text-black">+</Text>
  </TouchableOpacity>
);

const ShoppingList = (props: { groupId: string }) => {
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(
    allItemsCollection,
    where("inGroup", "==", props.groupId),
    orderBy("isBought", "asc"),
    orderBy("created", "desc")
  );
  const [allItems, loading2, error2] = useCollection(q);
  if (!allItems) return;

  return (
    <ScrollView className="flex-1 flex-col h-full w-full bg-white ">
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
    </ScrollView>
  );
};

const MyItems = (props: { groupId: string }) => {
  const user = auth.currentUser?.uid as string;
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(
    allItemsCollection,
    where("inGroup", "==", props.groupId),
    where("ownedBy", "==", user),
    orderBy("isBought", "asc"),
    orderBy("created", "desc")
  );
  const [allItems, loading, error] = useCollection(q);
  if (!allItems) return;

  return (
    <ScrollView className="flex-1 flex-col h-full w-full bg-white ">
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
    </ScrollView>
  );
};

const Purchases = (props: { groupId: string }) => {
  const user = auth.currentUser;
  const purchaseRef = collection(db, "groups", props.groupId, "purchases");
  const q = query(purchaseRef, orderBy("createdAt", "desc"));
  const [purchases, loading, error] = useCollection(q);

  if (!purchases) return;

  return (
    <>
    <ScrollView className="flex-1 flex-col h-full w-full bg-white ">
      {purchases.docs.map((d) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/purchaseInfoModal",
              params: { id: d.id, title: d.data().title },
            })
          }
          className="w-full flex-1 flex-row p-4 max-h-20 items-center justify-between"
        >
          <View className="flex-row items-center">
            <Avatar userId={d.data().createdBy} />
            <Text className="ml-5 font-medium">{d.data().title}</Text>
          </View>
          <Text>{d.data().price} kr</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
     <TouchableOpacity
     onPress={() =>
       router.push({
         pathname: '/balanceModal',
         params: { groupId: props.groupId },
       })
     }
     className="absolute bottom-[120px] rounded-full right-5 border-4 border-[#0782F9] w-16 h-16 flex-1 justify-center items-center"
   >
     <FontAwesome name="money" color="#0782F9" size={20} />
   </TouchableOpacity>
   </>
  );
};

const renderScene = (route: any, groupId: string) => {
  switch (route.key) {
    case "shopping":
      return <ShoppingList groupId={groupId} />;
    case "items":
      return <MyItems groupId={groupId} />;
    case "purchases":
      return <Purchases groupId={groupId} />;
  }
};

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#0782F9" }}
    labelStyle={{ color: "black", fontSize: 12 }}
    activeColor="#0782F9"
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
    <View className="flex-1 bg-white">
      <ScrollView horizontal className="max-h-14 pl-2 m-1 mt-4 flex-1 bg-white">
        {group.users.map((e: string) => (
          <Header key={e} userId={e} />
        ))}
        <AddMemberButton groupId={groupId}></AddMemberButton>
      </ScrollView>

      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={(props: any) => renderScene(props.route, groupId)}
        onIndexChange={setIndex}
      />

      {routes[index].key !== "purchases" ? (
        <AddButton pathname="/addItem" groupId={groupId} />
      ) : (
        <AddButton pathname="/addPurchase" groupId={groupId} />
      )}
    </View>
  );
}
