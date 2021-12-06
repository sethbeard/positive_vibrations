import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import AppContext from "./GlobalStore";
import constants from "../constants";
import { PlaylistModal } from "./PlaylistModal";

export default function Playlists({ navigation }) {
  const globalSettings = useContext(AppContext);

  //function to retrieve all of users playlists
  const getPlaylists = async () => {
    const auth = "Bearer " + globalSettings.token;
    const response = await fetch(constants.URL + "/me/playlists?limit=50", {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
    const res = await response.json();
    return res;
  };

  //general state objects for this screen
  const [isModalVisible, setismodalvisible] = useState(false);
  const [dataChosen, setDataChosen] = useState(false);
  const [playlists, setPlaylists] = useState(getPlaylists());

  //function to save option chosen in the modal
  const setData = (object) => {
    setDataChosen(true);
    globalSettings.setCurrentPlaylist(object);
    globalSettings.setMainImagePath(object.images[0].url);
  };

  //controls modal visibility and saves all playlists to global store
  const changeModalVisibility = (bool) => {
    globalSettings.setAllPlaylists(playlists._W.items);
    setismodalvisible(bool);
  };

  return (
    <>
      {/* checks that playlists have been fetched, shows activity indicator if not  */}
      {playlists.length < 1 ? (
        <ActivityIndicator size="large" color={constants.primary} />
      ) : (
        <View style={styles.container}>
          <View style={styles.secondBackground} />
          <View style={styles.background}>
            {dataChosen ? (
              <Text style={styles.heading}>Playlist Chosen:</Text>
            ) : (
              <Text style={styles.heading}>Choose a Playlist:</Text>
            )}

            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => changeModalVisibility(true)}
            >
              <Text style={styles.text}>
                {globalSettings.currentPlaylist.name}
              </Text>
            </TouchableOpacity>

            <Image
              source={{
                uri: globalSettings.mainImagePath,
              }}
              style={styles.image}
            />

            {dataChosen ? (
              <View style={{ height: 100, alignSelf: "stretch" }}>
                <TouchableOpacity
                  visible={dataChosen}
                  style={styles.button}
                  onPress={() => navigation.navigate("Search")}
                >
                  <Text style={styles.buttonText}> Next </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}

            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}
              onRequestClose={() => changeModalVisibility(false)}
            >
              <PlaylistModal
                changeModalVisibility={changeModalVisibility}
                setData={setData}
                playlists={playlists._W}
              />
            </Modal>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.primary,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
    paddingTop: 20,
  },
  background: {
    flex: 1,
    backgroundColor: constants.background,
    height: "100%",
    width: "100%",
    borderTopEndRadius: 1000,
    position: "absolute",
    bottom: 0,
    elevation: 10,
  },
  text: {
    marginVertical: 20,
    fontSize: 20,
    color: constants.background,
  },
  touchableOpacity: {
    backgroundColor: constants.dark,
    alignSelf: "stretch",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  heading: {
    color: constants.dark,
    fontSize: 50,
    alignSelf: "flex-start",
    paddingBottom: 20,
    paddingTop: 40,
  },
  image: {
    marginTop: 50,
    width: 350,
    height: 350,
    marginBottom: 20,
    alignSelf: "center",
    opacity: 0.75,
    borderRadius: 10,
  },
  button: {
    flex: 1,
    alignSelf: "center",
    width: "95%",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
    backgroundColor: constants.dark,
    borderRadius: 90,

    shadowColor: "#0000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.99,
    shadowRadius: 4.0,

    elevation: 24,
  },
  buttonText: {
    fontSize: 30,
    color: constants.background,
    alignSelf: "center",
    textShadowRadius: 13.0,
    elevation: 10,
  },
  secondBackground: {
    flex: 1,
    backgroundColor: constants.tertiary,
    height: "50%",
    width: "100%",
    borderTopLeftRadius: 1000,
    borderBottomStartRadius: 1000,
    borderBottomEndRadius: 2000,
    position: "absolute",
    top: -20,
    right: -100,
    elevation: 5,
  },
});
