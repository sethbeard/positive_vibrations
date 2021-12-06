import React, { useContext, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import constants from "../constants";
import AppContext from "./GlobalStore";

const PlaylistInfo = (props) => {
  const globalSettings = useContext(AppContext);

  //all of the properties shown for the playlist
  const [properties, setProps] = useState([
    "danceability",
    "energy",
    "loudness",
    "valence",
    "tempo",
  ]);

  //this set of calls controls the ability to play the track in their current active player
  //it first finds all of the users devices and then filters out only the active ones
  //then it queues the track to the first active player
  //it waits to make sure that the queueing is done and then tells the player to skip to the next song (since there is no direct 'hey spotify play this song')
  //if the player isn't actually playing, it then starts playback.
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

    await response.json().then(
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
      ).catch((error) => console.log(error))
    );

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

  //begins the removal process, asks for confirmation from user before removing the song
  const removeTrack = (song) => {
    Alert.alert(
      "Remove Track?",
      "Are you sure you want to remove track " +
        song.track.name +
        "? \n\nThis can't be undone (I mean you can always add it back I guess.. there's just not an undo button)",
      [
        {
          text: "Nope",
          style: "cancel",
        },
        { text: "Trash that song!", onPress: () => deleteTrack(song) },
      ]
    );
  };

  //sends the api call to remove the song from the playlist and then sends the alert for confirmation
  const deleteTrack = async (song) => {
    await fetch(
      "https://api.spotify.com/v1/playlists/" +
        globalSettings.currentPlaylist.id +
        "/tracks",
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + globalSettings.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracks: [{ uri: "spotify:track:" + song.track.id }],
        }),
      }
    )
      .then(alert(song))
      .then(props.getTrackInformation)
      .catch((error) => console.log(error));
  };

  //creates the alert for when a song is deleted
  const alert = (song) =>
    Alert.alert("Removed", "" + song.track.name + " removed", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);

  //this is the render for the songs in the playlist itself.  gives each one their artist name, track name and then the icons to play/remove
  const renderItem = (item) => {
    let song = item.item;
    return (
      <View style={styles.row} key={song.track.id}>
        <View style={styles.text}>
          <Text style={styles.artist}>{song.track.artists[0].name} :</Text>
          <Text style={styles.track}>{song.track.name} </Text>
        </View>
        <View style={styles.icons}>
          <Icon
            iconStyle={styles.play}
            name="play-circle"
            type="font-awesome"
            color={constants.dark}
            size={35}
            onPress={() => playTrack(song.track.id)}
          />
          <Icon
            iconStyle={styles.play}
            name="minus-square"
            type="font-awesome"
            color={constants.dark}
            size={35}
            onPress={() => removeTrack(song)}
          />
        </View>
      </View>
    );
  };

  //used for calculating averages of the props set above
  const average = (arr, prop) => {
    let sum = 0;
    arr.forEach((item) => {
      sum += item[prop] ?? 0;
    });
    return (sum / arr.length).toFixed(2);
  };

  //since popularity is pulled from another set of information it gets it's own function (since the prop option isn't needed)
  const AveragePopularity = (arr) => {
    let sum = 0;
    arr.forEach((item) => {
      sum += item.track.popularity ?? 0;
    });
    return Math.floor(sum / arr.length);
  };

  //renders the actual properties to be shown at the top of the modal
  const renderProperties = (arr, properties) => {
    return properties.map((item) => (
      <View style={styles.propertiesRow} key={properties.indexOf(item)}>
        <Text style={styles.artist} key={properties.indexOf(item)}>
          {item.charAt(0).toUpperCase() + item.slice(1)} :
        </Text>
        <Text style={styles.track}> {average(arr, item)}</Text>
      </View>
    ));
  };
  return (
    <View style={styles.main}>
      <View style={styles.backgroundOne} />
      <View style={styles.backgroundTwo} />
      <View style={styles.backgroundThree} />
      <View style={styles.backgroundFour} />
      <View style={{ justifyContent: "flex-start", elevation: 20 }}>
        <Icon
          iconStyle={styles.play}
          name="times-circle"
          type="font-awesome"
          color={constants.dark}
          size={35}
          onPress={() => props.closeInfo(false)}
        />
      </View>
      <View style={{ elevation: 300, alignItems: "center" }}>
        <Text style={styles.artist}> Average </Text>
        {renderProperties(globalSettings.trackInformation, properties)}
      </View>
      <View style={styles.propertiesContainer}>
        <Text style={styles.artist}>Popularity : </Text>
        <Text style={styles.track}>
          {AveragePopularity(globalSettings.playlistInformation)}
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={globalSettings.playlistInformation}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default PlaylistInfo;

const styles = StyleSheet.create({
  backgroundOne: {
    flex: 1,
    backgroundColor: constants.tertiary,
    borderRadius: 1300,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    left: -60,
    bottom: -120,
    height: "100%",
    elevation: 5,
  },
  backgroundTwo: {
    flex: 1,
    backgroundColor: constants.tertiary,
    borderRadius: 1300,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    left: 100,
    bottom: -80,
    height: "100%",
    elevation: 5,
  },
  backgroundThree: {
    flex: 1,
    backgroundColor: constants.background,
    borderRadius: 1300,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    left: -40,
    bottom: -140,
    height: "100%",
    elevation: 10,
  },
  backgroundFour: {
    flex: 1,
    backgroundColor: constants.background,
    borderRadius: 1300,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    left: 120,
    bottom: -100,
    height: "100%",
    elevation: 10,
  },
  propertiesContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    elevation: 30,
  },
  propertiesRow: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
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
