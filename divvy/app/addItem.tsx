import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Text, TextInput } from "react-native";
import {
  AutocompleteDropdownContextProvider,
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";


export default function AddItem() {
  const params = useLocalSearchParams();
  const groupId = params?.groupId
  const [item, setItem] = useState("");
  const [categroy, setCategroy] = useState<TAutocompleteDropdownItem | null>(null);

 
  return (
    <AutocompleteDropdownContextProvider>
      <KeyboardAvoidingView className="flex-1 h-full w-full bg-black">
        <TextInput placeholder="Item"></TextInput>
        <TextInput placeholder="Categorybun "></TextInput>
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          onSelectItem={setCategroy}
          dataSet={[
            { id: '1', title: 'Alpha' },
            { id: '2', title: 'Beta' },
            { id: '3', title: 'Gamma' },
          ]}
        />
      </KeyboardAvoidingView>
    </AutocompleteDropdownContextProvider>
  );
}
