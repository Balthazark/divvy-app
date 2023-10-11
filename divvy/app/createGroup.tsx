import { useEffect, useState } from "react";
import { View,Text, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { auth,db } from "../config/firebase";
import {doc,getDoc,addDoc,collection, getDocs } from "firebase/firestore";
import { router } from "expo-router";


export default function CreateGroup(){
    const [groupName, setGoupName] = useState('')
    const [users, setUsers] = useState([''])
    const user = auth.currentUser?.uid
    
   useEffect(() => {
    getAllUsers().then((res) =>{
        //@ts-ignore
        let usersList = [];
        res.forEach((doc) => {
            usersList.push(doc.id)
        })
        //@ts-ignore
        setUsers(usersList)
    })
   },[])

    const handleSubmit =  () => {
        if(groupName.length > 0){
            createGroup(users,groupName)

        }else{
            console.log('No group name')
        }

    }


    

    return(
        <KeyboardAvoidingView
        className="flex-1 justify-center items-center"
        behavior="padding"
      >
        <View className="w-4/5">
          <TextInput
            placeholder="Name your party"
            value={groupName}
            onChange={(event) => setGoupName(event.nativeEvent.text)}
            className="bg-white py-4 px-2 rounded-xl mt-1.5"
          />

        </View>

        <View className="w-3/4 mt-10">
        <TouchableOpacity
          onPress={() => handleSubmit()}
          className=" w-full p-2 rounded-xl items-center border"
        >
          <Text className="text-black font-bold text-base"> + Add new party &#129395;</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>

    )
}

const getUsers = async (user:any) => {

    const docRef = doc(db,'users',user)
    
   return await getDoc(docRef);  
}

const getAllUsers = async () => {
    const userRef = collection(db,'users');
    return await getDocs(userRef)
}

const createGroup = async (users:string[],groupName:string) =>{
    const groupData = {
        groupName: groupName,
        users: users,
    }

    const docRef = await addDoc(collection(db,'groups'),groupData)

    console.log('new group with id: ' + docRef.id)
}