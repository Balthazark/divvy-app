import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from "expo-router";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, collection, collectionGroup, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useCollection, useCollectionData, useDocument } from "react-firebase-hooks/firestore";



interface GroupProps{
    id: string,
    name: string,
    users: string[]
}


const FirstRoute = () => (
    <View className="bg-white h-full w-full z-10" />
  );

const addNewCategory = () =>(
    <View></View>
)
  
  
  const renderScene = SceneMap({
    first: FirstRoute,
  });

  const renderTabBar = (props:any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'black' }}
            labelStyle={{color:'black'}}
            className='bg-white text-black'
            scrollEnabled={true}
        />   
  );

export default function Group(props:GroupProps){
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'first', title: 'All items' },
    ]);

    const params = useLocalSearchParams()
    const groupId = 'AP8BX5jriOJ3PXiPOD48';

    const groupRef = doc(db,'groups',groupId)
    const [group,loading,error] = useDocument(groupRef)
    const catCollection = collection(db,'groups',groupId,'categories')
    const [categories,loading1,error1] = useCollection(catCollection)
    const allItemsCollection = collectionGroup(db,'Items')
    const q = query(allItemsCollection,where('inGroup','==',groupId))
    const [allItems,loading2,error2] = useCollection(q)
    
    console.log(allItems?.docs[0].data())
    return(
        <View className="flex-1">
          <TabView
          renderTabBar={renderTabBar}
          navigationState={{index,routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
        <TouchableOpacity onPress={() => router.push({pathname:'/addItem', params:{groupId:'asdas', userId: 'david'}})} className="absolute bottom-10 rounded-full right-5 bg-black w-11 h-11 flex-1 justify-center items-center">
           <FontAwesome name="plus" color='#FFFFFF' size={20} />
        </TouchableOpacity>
        </View>
    )
}



