import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { PlaylistModal } from "./PlaylistModal";
import constants from "../constants";
import PlaylistInfo from "./PlaylistInfo";
import AppContext from "./GlobalStore";
import { NavigationContainer } from "@react-navigation/native";
import { dismissAuthSession } from "expo-web-browser";

const Header = (props) => {
  const globalSettings = useContext(AppContext);
  let chosenPlaylist = globalSettings.currentPlaylist;
  let imageUrl = globalSettings.mainImagePath;
  const [isModalVisible, setismodalvisible] = useState(false);
  const [isInfoVisible, setInfoVisible] = useState(false);

  //sets to a new playlist
  const setPlaylist = (object) => {
    globalSettings.setCurrentPlaylist(object);
    globalSettings.setMainImagePath(object.images[0].url);
  };

  //toggles the playlist modal
  const changeModalVisibility = (bool) => {
    setismodalvisible(bool);
  };

  //toggles the playlist information modal
  const closeInfo = (bool) => {
    setInfoVisible(bool);
  };
  //grabs playlist data and track information
  const getTrackInformation = async () => {
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/" + chosenPlaylist.id,
      {
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
      }
    );
    const tracks = await response.json();
    globalSettings.setPlaylistInformation(tracks.tracks.items);

    //creates a string of all tracks in the playlist, then calls for the audio features of each track
    let tracksString = "";
    tracks.tracks.items.map(
      (track) => (tracksString += "" + track.track.id + ",")
    );
    const info = await fetch(
      "https://api.spotify.com/v1/audio-features?ids=" + tracksString,
      {
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
      }
    );
    const trackInfo = await info.json();
    globalSettings.setTrackInformation(trackInfo.audio_features);
    setInfoVisible(true);
  };

  return (
    <View style={styles.background}>
      <TouchableOpacity
        onPress={() => changeModalVisibility(true)}
        style={styles.touchable}
      >
        <View style={{ width: "80%" }}>
          <Text style={styles.heading}>Current Playlist:</Text>
          <Text style={styles.heading} numberOfLines={2} ellipsizeMode="tail">
            {chosenPlaylist.name}
          </Text>
        </View>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: imageUrl,
          }}
        />
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={styles.subheading}>
          #of Songs: {chosenPlaylist.tracks.total}
        </Text>
        <View style={styles.row}>
          <View>
            <Icon
              style={{}}
              name="info-circle"
              type="font-awesome"
              size={24}
              color={constants.primary}
              onPress={() => getTrackInformation()}
            />
          </View>
          <View>
            <Text style={styles.subheadingTwo}>Playlist</Text>
            <Text style={styles.subheadingTwo}>Information</Text>
          </View>
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => changeModalVisibility(false)}
        style={{ elevation: 100 }}
      >
        <PlaylistModal
          changeModalVisibility={changeModalVisibility}
          setData={setPlaylist}
          playlists={globalSettings.allPlaylists}
        />
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isInfoVisible}
        onRequestClose={() => setInfoVisibility(false)}
      >
        <PlaylistInfo
          closeInfo={closeInfo}
          getTrackInformation={getTrackInformation}
        />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    backgroundColor: constants.dark,
    elevation: 10,
    paddingVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: constants.dark,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    paddingTop: 10,
    alignContent: "center",
    alignItems: "center",
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
  },
  heading: {
    color: constants.secondary,
    fontSize: 25,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  subheading: {
    color: constants.secondary,
    fontSize: 15,
  },
  subheadingTwo: {
    color: constants.secondary,
    fontSize: 15,
    textAlign: "center",
    marginLeft: 15,
  },
  input: {
    height: 40,
    alignSelf: "stretch",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  tinyLogo: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: "center",
  },
  header: {
    height: "25%",
    width: "85%",
  },
});

export default Header;
