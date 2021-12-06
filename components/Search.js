import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import constants from "../constants";
import Header from "./Header";
import { Button } from "react-native-elements/dist/buttons/Button";
import AppContext from "./GlobalStore";
import "react-native-url-polyfill/auto";

import { TouchableOpacity } from "react-native-gesture-handler";
import GenreModal from "./GenreModal";

export default function Search({ navigation }) {
  const globalSettings = useContext(AppContext);
  //controls the genreModal
  const [toggleGenre, setToggleGenre] = useState("false");

  //creates the query string for the api search call
  //checks if there is an end year and start year, if not then skips adding the year option.
  // if only an end year is entered then it searches for that specific year.
  const createQueryString = () => {
    let queryString = constants.URL + "/search?q=" + globalSettings.query;
    if (globalSettings.endYear && globalSettings.startYear) {
      queryString +=
        " year:" +
        globalSettings.startYear +
        "-" +
        globalSettings.endYear +
        " ";
    } else if (globalSettings.endYear && !globalSettings.startYear) {
      queryString += " year:" + globalSettings.endYear + " ";
    }
    //takes care of the genre string, formatting properly.
    if (globalSettings.chosenGenres) {
      let arr = " genre:" + globalSettings.chosenGenres.replace(/ /g, "_");
      queryString += arr;
    }
    queryString += "&type=track&limit=35";
    return queryString;
  };

  //takes care of the actual search call to the api. fairly standard.
  const searchResults = async () => {
    const auth = "Bearer " + globalSettings.token;
    const response = await fetch(createQueryString(), {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
    const res = await response.json();
    globalSettings.setSearchResults(res.tracks.items);
  };

  // starts the function for the api call and then when done sends the user to the search results page.
  const letsSearch = async () => {
    await searchResults();
    navigation.navigate("SearchResults");
  };

  //this makes sure that funky stuff isn't done with the year.
  //Needs a bit of revising for other cases, but for the most part, makes sure the start date isn't after the end date, that neither are greater than the current year etc.
  const checkYear = () => {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear().toString();
    if (
      (globalSettings.startYear < 1900 && globalSettings.startYear !== "") ||
      globalSettings.startYear > currentYear
    ) {
      globalSettings.setStartYear(currentYear);
    }
    if (globalSettings.endYear < globalSettings.startYear) {
      globalSettings.setEndYear(globalSettings.startYear);
    } else if (
      globalSettings.endYear > currentYear ||
      globalSettings.endYear < 1900
    ) {
      globalSettings.setEndYear(currentYear);
    }
  };

  //modal toggling yay!
  const changeModalVisibility = (bool) => {
    setToggleGenre(bool);
  };

  return (
    <>
      <View style={styles.background}>
        <View style={styles.background2}>
          <View style={styles.background3}></View>
        </View>
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          alignContent: "center",
          position: "absolute",
          width: "100%",
        }}
      >
        <View>
          <Header />
          <TextInput
            style={styles.input}
            value={globalSettings.query}
            placeholder="Search"
            onChangeText={(text) => {
              globalSettings.setQuery(text);
            }}
          />

          <View style={styles.filterRow}>
            <Text> Filter By Years:</Text>
            <TextInput
              style={styles.input}
              value={globalSettings.startYear}
              keyboardType="numeric"
              placeholder="Starting Year"
              maxLength={4}
              onChangeText={(text) => {
                globalSettings.setStartYear(text);
              }}
              onEndEditing={() => checkYear()}
            />
            <Text>-</Text>
            <TextInput
              style={styles.input}
              value={globalSettings.endYear}
              keyboardType="numeric"
              placeholder="Ending Year"
              maxLength={4}
              onChangeText={(text) => {
                globalSettings.setEndYear(text);
              }}
              onEndEditing={() => checkYear()}
            />
          </View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setToggleGenre(true)}
          >
            <Text style={{ color: "grey" }}>
              Genre: {globalSettings.chosenGenres}
            </Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/cassette.gif")}
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Button
            icon={{ name: "search", size: 15, color: "white" }}
            title="Search"
            buttonStyle={{
              backgroundColor: constants.dark,
              height: 50,
            }}
            disabled={globalSettings.query === ""}
            disabledStyle={{ backgroundColor: constants.secondary }}
            titleStyle={{ fontSize: 16, fontWeight: "bold" }}
            onPress={() => letsSearch()}
          />
        </View>
        <Modal
          transparent={false}
          animationType="fade"
          visible={toggleGenre}
          onRequestClose={() => setToggleGenre(false)}
        >
          <GenreModal changeModalVisibility={changeModalVisibility} />
        </Modal>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: constants.tertiary,
  },
  background2: {
    flex: 1,
    backgroundColor: constants.secondary,
    borderBottomEndRadius: 1000,
    borderTopEndRadius: 300,
    elevation: 5,
  },
  background3: {
    flex: 1,
    position: "absolute",
    top: -20,
    left: -20,
    width: "100%",
    height: "100%",
    backgroundColor: constants.background,
    borderBottomEndRadius: 1000,
    borderTopEndRadius: 500,
    elevation: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    height: 40,
    alignSelf: "stretch",
    margin: 12,
    paddingLeft: 10,
    borderWidth: 1,
    padding: 10,
    // backgroundColor: constants.background,
    borderRadius: 10,
  },
  play: {
    marginRight: 5,
  },
  genreName: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
