import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { collection,getDocs,query,where } from 'firebase/firestore';
import { auth,db } from '../../config/firebase';
import { useEffect, useState } from 'react';

export default function TabOneScreen() {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getGroups().then((res) => {
      //@ts-ignore
      let group = []
      res.forEach(g => {
        group.push(g.id)
      })      
      //@ts-ignore
      setGroups(group)

    })


  }, [])
  

  return (
     <View className='flex-1 items-center justify-start'>
       <View className="w-3/4 mt-10">
        <TouchableOpacity
          onPress={() => router.push('/createGroup')}
          className=" w-full p-2 rounded-xl items-center border"
        >
          <Text className="text-black font-bold text-base"> + Add new party &#129395;</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-1 justify-center h-full'>
        {groups.map(g => <Text>Group {g} </Text>)}
      </View>
      
     </View>
  );
}

const getGroups = async () =>{
  const user = auth.currentUser?.uid

  const groupRef = collection(db,'groups')
  const q = query(groupRef, where('users','array-contains',user))
  const snapshot = await getDocs(q)

  return snapshot;
}

