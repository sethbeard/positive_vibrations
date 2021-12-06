import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AppContext from "./GlobalStore";
import constants from "../constants";
import { useEffect, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native-elements";
WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function login({ navigation }) {
  //imports all of the variables and functions from the AppContext
  const globalSettings = useContext(AppContext);

  //Spotify request and redirect
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: constants.clientId,
      scopes: [
        "user-read-email",
        "playlist-modify-public",
        "user-modify-playback-state",
        "user-read-playback-state",
        "playlist-read-private",
        "playlist-modify-private",
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.1.8:19000/--/",
    },
    discovery
  );

  // once the response is returned as successful sets the global token and sends to the playlists screen
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      globalSettings.setToken(access_token);
      globalSettings.setLogout(navigation.navigate("Home"));
      navigation.navigate("Playlists");
    }
  }, [response]);

  return (
    <View style={{ flex: 1, height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <View style={styles.third}>
          <View style={styles.fourth}>
            <View style={styles.second}>
              <View style={styles.mainContainer}>
                <Text style={styles.title}>Positive Vibrations</Text>
              </View>
              <StatusBar style="auto" />
            </View>
          </View>
        </View>
        <Button
          buttonStyle={styles.login}
          disabled={!request}
          title="Login With Spotify"
          titleStyle={{
            color: constants.background,
            fontWeight: "bold",
            fontSize: 20,
          }}
          onPress={() => {
            promptAsync();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.background,
    justifyContent: "center",
  },
  second: {
    borderTopLeftRadius: 1000,
    width: "90%",
    height: "90%",
    borderBottomLeftRadius: 1000,
    backgroundColor: constants.secondary,
    elevation: 30,
    alignSelf: "flex-end",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: 60,
    fontWeight: "700",
    textAlign: "right",
    marginRight: 10,
  },
  login: {
    marginTop: 10,
    backgroundColor: constants.dark,
    height: 70,
    elevation: 1,
  },
  third: {
    borderTopLeftRadius: 1000,
    width: "100%",
    height: "90%",
    borderBottomLeftRadius: 1000,
    backgroundColor: constants.dark,
    alignSelf: "flex-end",
    elevation: 10,
  },
  fourth: {
    borderTopLeftRadius: 1000,
    width: "90%",
    height: "90%",
    borderBottomLeftRadius: 1000,
    backgroundColor: constants.tertiary,
    alignSelf: "flex-end",
    elevation: 20,
  },
});
