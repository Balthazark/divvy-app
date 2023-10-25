import { View, Text } from "react-native";
import { auth, db } from "../config/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { Friend } from "../types/user";
import { Avatar } from "./Item";
import { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useAtom } from "jotai";
import { selectedFriendsAtom } from "../app/createGroup";

type FriendListProps = {
  interactive: boolean;
  onlySelectedFriends: boolean;
  membersToExclude?: string[];
};

type FriendProps = {
  friendData: Omit<Friend, "email">;
  interactive: boolean;
  checked: boolean;
};

const FriendElement = ({ friendData, interactive, checked }: FriendProps) => {
  const [isChecked, setChecked] = useState<boolean>(checked);
  const [value, setValue] = useAtom(selectedFriendsAtom);

  const handleFriendSelect = (userId: string) => {
    if (!value.includes(userId)) {
      setValue([...value, userId]);
    } else {
      const updatedValue = value.filter((id) => id !== userId);
      setValue(updatedValue);
    }
  };
  useEffect(() => {
    console.log("VALUE IN EFFECT", value);
  }, [value]);

  const handleCheck = (value: boolean) => {
    setChecked(value);
    handleFriendSelect(friendData.userId);
  };

  if (!interactive) {
    return (
      <View
        className="flex-row items-center justify-between space-x-2 border-b border-slate-300 p-4 mx-auto"
        key={friendData.userId}
      >
        <Avatar userId={friendData.userId} />
        <View className="flex-grow">
          <Text className="text-md">
            {friendData.name + " " + friendData.lastName}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-row items-center justify-between space-x-2 border-b border-slate-300 p-4 mx-auto"
      key={friendData.userId}
    >
      <Avatar userId={friendData.userId} />
      <View className="flex-grow">
        <Text className="text-md">
          {friendData.name + " " + friendData.lastName}
        </Text>
      </View>
      <Checkbox
        value={isChecked}
        onValueChange={handleCheck}
        className="justify-self-end"
      />
    </View>
  );
};

export default function FriendList({
  interactive,
  onlySelectedFriends,
  membersToExclude,
}: FriendListProps) {
  const [selectedFriends] = useAtom(selectedFriendsAtom);

  const user = auth.currentUser;
  const [value, loading, error] = useDocumentData(doc(db, "users", user!.uid));

  if (value?.friends.length === 0) {
    return <Text>You have not added any friends yet!</Text>;
  }

  if (!interactive) {
    return (
      <View className="bg-white">
        {value?.friends.map((friend: Friend) => {
          return (
            <FriendElement
              key={friend.userId}
              friendData={friend}
              interactive={false}
              checked={false}
            ></FriendElement>
          );
        })}
      </View>
    );
  }

  if (onlySelectedFriends) {
    return (
      <View className="bg-white">
        {value?.friends
          .filter((friend: Friend) => selectedFriends.includes(friend.userId))
          .map((friend: Friend) => {
            const isChecked = selectedFriends.includes(friend.userId);
            return (
              <FriendElement
                key={friend.userId}
                friendData={friend}
                interactive={true}
                checked={isChecked}
              ></FriendElement>
            );
          })}
      </View>
    );
  }

  if (membersToExclude?.length !== 0 && membersToExclude) {
    return (
      <View className="bg-white">
        {value?.friends
          .filter((friend: Friend) => !membersToExclude.includes(friend.userId))
          .map((friend: Friend) => {
            return (
              <FriendElement
                key={friend.userId}
                friendData={friend}
                interactive={true}
                checked={false}
              ></FriendElement>
            );
          })}
      </View>
    );
  }

  return (
    <View className="bg-white">
      {value?.friends.map((friend: Friend) => {
        const isChecked = selectedFriends.includes(friend.userId);
        return (
          <FriendElement
            key={friend.userId}
            friendData={friend}
            interactive={true}
            checked={isChecked}
          ></FriendElement>
        );
      })}
    </View>
  );
}
