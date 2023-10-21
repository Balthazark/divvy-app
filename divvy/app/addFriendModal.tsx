import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { View } from "react-native";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import FriendList from "../components/FriendList";

export default function addFriendModal() {
  const [seachParam, setSearchParam] = useState("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView>
        <View>
          <TextInput
            placeholder="Search for user email"
            value={seachParam}
            onChange={(event) => setSearchParam(event.nativeEvent.text)}
            className="bg-white p-2 rounded-xl mt-1"
          ></TextInput>
          <FriendList></FriendList>
        </View>
      </ScrollView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </KeyboardAvoidingView>
  );
}
