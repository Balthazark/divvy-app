import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { router } from "expo-router";

export default function LogoutScreen() {
  const handleSignout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Logout tab</Text>
      <TouchableOpacity
        onPress={handleSignout}
        className="bg-[#0782F9] w-80 p-2 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-base">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
