import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY;

const MapboxTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchMapboxPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 2) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          text
        )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5&language=en&country=pk`
      );
      const data = await response.json();
      setResults(data.features);
    } catch (error) {
      console.error("Mapbox search error:", error);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(item.place_name);
    setResults([]);
    handlePress({
      latitude: item.geometry.coordinates[1],
      longitude: item.geometry.coordinates[0],
      address: item.place_name,
    });
  };

  return (
    <View style={[styles.container, containerStyle && { containerStyle }]}>
      <View style={styles.inputWrapper}>
        <View style={styles.iconWrapper}>
          <Image
            source={icon ? icon : icons.search}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <TextInput
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={query}
          onChangeText={searchMapboxPlaces}
          style={[
            styles.textInput,
            { backgroundColor: textInputBackgroundColor || "white" },
          ]}
        />
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          style={[
            styles.resultList,
            { backgroundColor: textInputBackgroundColor || "white" },
          ]}
        />
      )}
    </View>
  );
};

export default MapboxTextInput;

const styles = StyleSheet.create({
  container: {
    zIndex: 50,
    borderRadius: 15,
    marginHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 10,
    shadowColor: "#d4d4d4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 10,
    borderRadius: 50,
  },
  resultList: {
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: "#d4d4d4",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});
