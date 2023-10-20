import { ActivityIndicator, Text, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { auth, db } from "../../config/firebase";
import {
  collectionGroup,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  useCollection,
} from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { ItemGroups } from "../../types/transformations";
import Checkbox from "expo-checkbox";

export default function MyItemsScreen() {
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "blue" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "black", fontSize: 12 }}
    />
  );

  const ItemsRoute = () => {
    const user = auth.currentUser;
    const allItemsCollection = collectionGroup(db, "Items");
    const q = query(allItemsCollection, where("ownedBy", "==", user?.uid));

    const [itemCollection, loading, error] = useCollection(q);
    console.log("collection", itemCollection);

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

    const itemGroups: ItemGroups = [];
    itemCollection?.docs.forEach((item) => {
      const { inGroup, inCategory, itemName, groupName, isChecked } =
        item.data();
      const itemId = item.id;

      let group = itemGroups.find((group) => group.groupId === inGroup);

      if (!group) {
        group = {
          groupId: inGroup,
          groupName: groupName, // or use a default name if needed
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

      category.items.push({ itemName, isChecked, itemId, inGroup, inCategory });
    });

    const CheckBoxWrapper = (props: {
      initialState: boolean;
      itemId: string;
      inGroup: string;
      inCategory: string;
    }) => {
      const [isChecked, setChecked] = useState<boolean>(props.initialState);

      const handleToggle = async (value: boolean) => {
        const itemRef = doc(db, "groups",props.inGroup,'categories',props.inCategory,'Items',props.itemId);
        await setDoc(itemRef,{isChecked:value},{merge:true})
        setChecked(value);
      };

      return (
        <Checkbox
          value={isChecked}
          onValueChange={handleToggle}
          color={isChecked ? "#4630EB" : undefined}
        />
      );
    };

    return (
      <FlashList
        data={itemGroups}
        renderItem={({ item }) => {
          return (
            <View className="flex-1 items-center justify-center">
              <Text className="text-xl font-bold">{item.groupName}</Text>
              {item.categories.map((category) => {
                return (
                  <>
                    <Text>{category.category}</Text>

                    {category.items.map((item) => (
                      <View>
                        <Text>{item.itemName}</Text>
                        <CheckBoxWrapper
                          initialState={item.isChecked}
                          itemId={item.itemId}
                          inCategory={item.inCategory}
                          inGroup={item.inGroup}
                        ></CheckBoxWrapper>
                      </View>
                    ))}
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

  const PurchaseRoute = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Tab Two</Text>
    </View>
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
