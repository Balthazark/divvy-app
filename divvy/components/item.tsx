import { useCollection, useDocumentData } from "react-firebase-hooks/firestore"
import { View,Text } from "react-native"

import { db } from "../config/firebase"
import { collection, collectionGroup, doc, query, setDoc, where } from "firebase/firestore"
import Checkbox from "expo-checkbox"
import { useEffect, useState } from "react"

interface ItemProps{
    id: string | undefined
    name: string
    isChecked: boolean
    isBought: boolean
    ownedBy: string
    groupId: string
    inCategory: string
}

export default function Item(props:ItemProps){
  //@ts-ignore
  const docRef = doc(db, "groups",props.groupId,'categories',props.inCategory,'Items',props.id);
  const [checkboxValue,loading,error] = useDocumentData(docRef)
  const [isChecked, setChecked] = useState<boolean>()

  useEffect(() => {
    setChecked(checkboxValue?.isChecked)
  }, [checkboxValue])
  

  

  const handleCheck =(value:boolean) => {
    setDoc(docRef,{isChecked:value},{merge:true})
    setChecked(value)
  }

  console.log(isChecked)
  if(props.isBought){
    console.log('asdasd')
        return(
          <View className="flex-1 flex-row content-center px-4 justify-between max-h-20 items-center bg-gray-200 border-b border-slate-300">
            <View className="flex-1 flex-row items-center">
            <Avatar userId={props.ownedBy}/>
            <Text className="mx-5 text-lg">{props.name}</Text>
            </View>
        </View>
        )
    }

    return(
        <View className="flex-1 flex-row content-center px-4 justify-between max-h-20 items-center bg-white border-b border-slate-300">
            <View className="flex-1 flex-row items-center">
            <Avatar userId={props.ownedBy}/>
            <Text className="mx-5 text-lg">{props.name}</Text>
            </View>
            <Checkbox value={isChecked} onValueChange={handleCheck} className="justify-self-end"/>
        </View>
    )

}


function Avatar(props:{userId:string}) {
    const [user, loading, error] = useDocumentData(
      doc(db, "users", props.userId)
    );
    
    console.log('dasdasd',user)

    if(!user){
        return(
            <View className="w-10 h-10 bg-gray-500 rounded-full justify-center items-center">
                <Text>+</Text>
            </View>
        )
    }

    return(
        <View
        style={{ backgroundColor: `${user.color}` }}
        className='w-10 h-10 rounded-full justify-center items-center'
      >
        <Text className="text-gray-700">
          {user.name.slice(0, 1)}
          {user.lastName.slice(0, 1)}
        </Text>
      </View>
    )
  }