import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

//Main entry point for root layout
//TODO, add auth here, render stack if authed, otherwise load signup/Login page.

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="signup"
        options={{
          presentation: "modal",
          title: "Signup",
        }}
      />
      <Stack.Screen name="createGroup" options={{ title: "Create group" }} />
      <Stack.Screen
        name="group"
        options={{
          headerTitle(props) {
            return (
              <Text className="font-bold">{useLocalSearchParams().title}</Text>
            );
          },
        }}
      />
      <Stack.Screen
        name="addItem"
        options={{ title: "Add Item", presentation: "modal" }}
      />
      <Stack.Screen
        name="assignUserModal"
        options={{
          headerShown: false,
          presentation: "containedTransparentModal",
        }}
      />
      <Stack.Screen
        name="removeItemModal"
        options={{
          headerShown: false,
          presentation: "containedTransparentModal",
        }}
      />
      <Stack.Screen
        name="addFriendModal"
        options={{ presentation: "modal", title: "Add friend" }}
      />
      <Stack.Screen
        name="addPurchase"
        options={{ title: "Add Purchase", presentation: "modal" }}
      />
      <Stack.Screen
        name="addGroupMemberModal"
        options={{ title: "Add group members", presentation: "modal" }}
      />
    </Stack>
  );
}
