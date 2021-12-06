import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import "react-native-url-polyfill/auto";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import constants from "../constants";
import AppContext from "./GlobalStore";
import Header from "./Header";
export default function SearchResults({ navigation }) {
  const globalSettings = useContext(AppContext);

  //adds track to the playlist
  const addTrack = async (trackId) => {
    console.log(trackId);
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/" +
        globalSettings.currentPlaylist.id +
        "/tracks?uris=spotify:track:" +
        trackId,

      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => console.log(error));

    Alert.alert("Track Added", "Track has been added to your playlist", [
      {
        text: "Thumbs Up (>^^)> ",
        style: "cancel",
      },
    ]);
  };

  //same function as the playlist info one
  const playTrack = async (trackId) => {
    const player = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: "Bearer " + globalSettings.token,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
    const parsePlayer = await player.json();
    const currentPlayer = parsePlayer.devices.filter(
      (device) => device.is_active
    );

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/queue?uri=spotify:track:" +
        trackId +
        "&device_id=" +
        currentPlayer[0].id,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => console.log(error));

    await response
      .json()
      .then(
        await fetch(
          "https://api.spotify.com/v1/me/player/next?device_id=" +
            currentPlayer[0].id,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + globalSettings.token,
              "Content-Type": "application/json",
            },
          }
        )
      )
      .catch((error) => console.log(error));

    if (!currentPlayer[0].is_active) {
      await fetch("https://api.spotify.com/v1/player/play", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
      }).catch((error) => console.log(error));
    }
  };

  //renders the actual results themselves
  const renderResults = (item) => {
    const song = item.item;

    return (
      <View style={styles.row} key={song.id}>
        <View style={styles.text}>
          <Text style={styles.artist}>{song.artists[0].name} :</Text>
          <Text style={styles.track}>{song.name} </Text>
        </View>
        <View style={styles.icons}>
          <Icon
            iconStyle={styles.play}
            name="play-circle"
            type="font-awesome"
            color={constants.dark}
            size={35}
            onPress={() => playTrack(song.id)}
          />
          <Icon
            iconStyle={styles.play}
            name="plus-square"
            type="font-awesome"
            color={constants.dark}
            size={35}
            onPress={() => addTrack(song.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainBackground}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundOne}>
          <View style={styles.backgroundTwo}>
            <Header />
            <View style={styles.results}>
              {globalSettings.searchResults < 1 ? (
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  Whomp Whomp, no matches for your Search
                </Text>
              ) : (
                <FlatList
                  data={globalSettings.searchResults}
                  renderItem={renderResults}
                  keyExtractor={(item) => item.id}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="New Search"
                buttonStyle={{
                  backgroundColor: constants.primary,
                  alignSelf: "stretch",
                  height: "100%",
                }}
                titleStyle={{ color: constants.darkBackground }}
                onPress={() => navigation.navigate("Search")}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  mainBackground: { backgroundColor: constants.tertiary, height: "100%" },
  safeArea: { backgroundColor: constants.secondary },
  backgroundOne: {
    backgroundColor: constants.secondary,
    borderRadius: 50,
    elevation: 5,
  },
  backgroundTwo: {
    backgroundColor: constants.background,
    borderRadius: 150,
    elevation: 10,
    justifyContent: "space-between",
    height: "100%",
  },
  results: {
    height: 500,
    borderWidth: 4,
    borderColor: constants.dark,
    marginVertical: 10,
  },

  row: {
    paddingBottom: 5,
    marginTop: 5,
    marginHorizontal: 5,
    borderBottomWidth: 3,
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    borderColor: constants.tertiary,
  },
  container: {
    borderColor: constants.tertiary,
    borderWidth: 2,
    margin: 3,
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 10,
    elevation: 10,
  },
  artist: {
    fontSize: 20,
    fontWeight: "bold",
    color: constants.dark,
  },
  track: {
    fontSize: 20,
    color: constants.darkBackground,
    fontWeight: "600",
  },
  text: {
    width: "60%",
    alignSelf: "center",
  },
  play: {
    marginRight: 5,
  },

  icons: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "flex-end",
  },
  main: {
    flex: 1,
    backgroundColor: constants.primary,
    alignItems: "center",
    borderRadius: 10,
    elevation: 100,
  },
});
