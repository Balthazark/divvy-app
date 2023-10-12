import { DocumentData, QueryDocumentSnapshot, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { View,Text } from "react-native";
import { db } from "../config/firebase";

interface GroupCardProps {
    doc: QueryDocumentSnapshot<DocumentData, DocumentData>;
}

export default function GroupCard(props:GroupCardProps){
    const docId = props.doc.id;
    const docData=props.doc.data()

    return(
        <View className="mx-5 h-20 rounded-xl border-2 my-1 justify-between p-2"> 
        <Text className="text-lg font-bold">{docData.groupName}</Text>
        <View className="flex-row w-full justify-end">
            {docData.users?.map((e:any)=> <Avatar key={e} userId={e} />)} 
        </View>      
    </View>
    )
}

interface AvatarProp{
    userId: string;
}

function Avatar(props:AvatarProp){
    const [user,loading,error] = useDocumentData(doc(db,'users',props.userId))

    return(
        <View className="w-7 h-7 mx-1 rounded-full bg-yellow-500 justify-center items-center" >
            <Text>
            {user?.Name.slice(0,1)}{user?.LastName.slice(0,1)}
            </Text>
        </View>
    )
}