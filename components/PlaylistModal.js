import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import constants from "../constants";
import AppContext from "./GlobalStore";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const PlaylistModal = (props) => {
  const globalSettings = useContext(AppContext);

  //used to handle pressing a playlist.  closes the modal and calls the function in the Playlists component to set all of the needed states
  const onPressItem = (option) => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  //maps through all of the playlists (saved to state in the playlists component) and renders each one. this was pretty early on and worked but would have rather used a flatlist.
  const option = globalSettings.allPlaylists.map((item, index) => {
    let imagePath = "";
    if (item.images.length < 1) {
      imagePath =
        "https://cdn.shopify.com/s/files/1/2009/8293/products/ZM1650.jpg?v=1575932437";
    } else {
      imagePath = item.images[0].url;
    }
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}
      >
        <View style={styles.row}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: imagePath,
            }}
          />
          <Text style={styles.text}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.container}
    >
      <View style={[styles.modal, { width: WIDTH - 20, height: HEIGHT - 10 }]}>
        <ScrollView>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: constants.dark,
    borderRadius: 10,
  },
  option: {
    alignItems: "flex-start",
  },
  text: {
    margin: 20,
    marginRight: 50,
    fontSize: 20,
    fontWeight: "bold",
    color: constants.background,
  },
  tinyLogo: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 5,
    width: "95%",
  },
});

export { PlaylistModal };
