import { useState } from "react";
import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


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
    second: FirstRoute,
    third: FirstRoute,
    four: FirstRoute,
  });

  const renderTabBar = (props:any) => (
    // <View className="flex-1 flex-row max-h-10 bg-white justify-between">
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'black' }}
            labelStyle={{color:'black'}}
            className='bg-white text-black'
            scrollEnabled={true}
        />
    /* <View  className="bg-yellow-500 h-10 w-10 justify-center items-center rounded-full -left-2 z-20"><Text> + </Text></View> */
    /* </View> */
   
  );

export default function Group(props:GroupProps){

    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'first', title: 'All items' },
      { key: 'second', title: 'Second' },
      { key:'third', title: 'Third'},
      { key:'four', title:'Four'}
    ]);
 


    return(
        <TabView
        
        renderTabBar={renderTabBar}
          navigationState={{index,routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
    )
}



