import React, { useContext, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import AppContext from "./GlobalStore";
import constants from "../constants";

export default function GenreModal(props) {
  //state management for the search results of the genres
  const [filteredGenres, setFilteredGenres] = useState([]);
  const globalSettings = useContext(AppContext);

  //filters out genres that match the search
  const filterGenres = async (req) => {
    let requestRegEx = new RegExp(req.toLowerCase());
    await setFilteredGenres(
      globalSettings.allGenres.filter((genre) => requestRegEx.test(genre))
    );
  };

  //sets the chosen genre and closes modal
  const addGenre = (item) => {
    globalSettings.setChosenGenres(item);
    props.changeModalVisibility(false);
  };

  //renders each individual genre in the flatlist
  const renderGenres = ({ item }) => {
    return (
      <View style={styles.genreRow}>
        <Text style={styles.genreName}>{item.toUpperCase()}</Text>
        <Icon
          iconStyle={styles.play}
          name="plus-square"
          type="font-awesome"
          color={constants.dark}
          size={35}
          onPress={() => addGenre(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.background2}>
        <View style={styles.background3}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              name="close"
              size={20}
              color="red"
              onPress={() => props.changeModalVisibility(false)}
              iconStyle={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.input}
              S
              placeholder="Genre Search"
              onChangeText={(text) => {
                filterGenres(text);
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              marginBottom: 10,
            }}
          ></View>
          <View
            style={{ borderColor: constants.dark, borderWidth: 2, bottom: 10 }}
          >
            <FlatList
              data={filteredGenres}
              renderItem={renderGenres}
              keyExtractor={(genre) => filteredGenres.indexOf(genre)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  genreRow: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderColor: constants.darkBackground,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    margin: 5,
  },
  background: {
    flex: 1,
    backgroundColor: constants.tertiary,
  },
  background2: {
    flex: 1,
    backgroundColor: constants.secondary,
    borderBottomEndRadius: 1000,
    borderTopEndRadius: 200,
    elevation: 5,
  },
  background3: {
    flex: 1,
    position: "absolute",

    width: "100%",
    height: "100%",
    backgroundColor: constants.background,
    borderBottomEndRadius: 1000,
    borderTopEndRadius: 8000,
    elevation: 10,
  },
  input: {
    height: 40,
    alignSelf: "stretch",
    width: "75%",
    margin: 12,
    paddingLeft: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  play: {
    marginRight: 5,
  },
  genreName: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 5,
  },
});
