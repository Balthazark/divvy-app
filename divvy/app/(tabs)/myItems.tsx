import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { auth, db } from "../../config/firebase";
import {
  collection,
  collectionGroup,
  doc,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { ItemGroups } from "../../types/transformations";
import Item, { Avatar } from "../../components/Item";
import { router } from "expo-router";

const ItemsRoute = () => {
  const user = auth.currentUser;
  const allItemsCollection = collectionGroup(db, "Items");
  const q = query(allItemsCollection, where("ownedBy", "==", user?.uid));

  const [itemCollection, loading, error] = useCollection(q);
  const itemGroups: ItemGroups = useMemo(() => {
    const itemGroups: ItemGroups = [];
    itemCollection?.docs.forEach((item) => {
      const { inGroup, inCategory, itemName, groupName, isChecked, ownedBy } =
        item.data();
      const itemId = item.id;

      let group = itemGroups.find((group) => group.groupId === inGroup);

      if (!group) {
        group = {
          groupId: inGroup,
          groupName: groupName,
          categories: [],
        };
        itemGroups.push(group);
      }

      let category = group.categories.find(
        (cat) => cat.category === inCategory
      );

      if (!category) {
        category = { category: inCategory, items: [] };
        group.categories.push(category);
      }

      category.items.push({
        itemName,
        isChecked,
        itemId,
        inGroup,
        inCategory,
        ownedBy,
      });
    });

    return itemGroups;
  }, [itemCollection]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (!itemCollection)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">
          You have no assigned items yet!
        </Text>
      </View>
    );

  return (
    <FlashList
      data={itemGroups}
      renderItem={({ item }) => {
        return (
          <View className="flex-1 items-start justify-center">
            <Text className="text-xl font-bold pt-4 pl-4">
              {item.groupName}
            </Text>
            {item.categories.map((category) => {
              return (
                <>
                  <Text className="text-lg pt-2 pl-4 text-grey">
                    {category.category}
                  </Text>
                  <View className="flex-1 items-center justify-center p-3">
                    {category.items.map((item) => (
                      <Item
                        key={item.itemId}
                        id={item.itemId}
                        name={item.itemName}
                        isChecked={item.isChecked}
                        isBought={false}
                        ownedBy={item.ownedBy}
                        groupId={item.inGroup}
                        inCategory={item.inCategory}
                        disableAssign={true}
                      ></Item>
                    ))}
                  </View>
                </>
              );
            })}
          </View>
        );
      }}
      estimatedItemSize={200}
    />
  );
};

const PurchaseRoute = () => {
  const user = auth.currentUser;
  const purchaseRef = collectionGroup(db, "purchases");
  const q = query(
    purchaseRef,
    where("createdBy", "==", user?.uid),
    orderBy("createdAt", "desc")
  );
  const [purchases, loading, error] = useCollection(q);

  if (!purchases) return;

  return (
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
  );
};


export default function MyItemsScreen() {
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#0782F9" }}
      activeColor="#0782F9"
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "black", fontSize: 12 }}
    />
  );

  const renderScene = SceneMap({
    first: ItemsRoute,
    second: PurchaseRoute,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Items" },
    { key: "second", title: "Purchases" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
    />
  );
}
