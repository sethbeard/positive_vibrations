import React from "react";
import Login from "./components/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Playlists from "./components/Playlists";
import { useState } from "react";
import AppContext from "./components/GlobalStore";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import genres from "./components/genres";
import "react-native-url-polyfill/auto";

const Stack = createNativeStackNavigator();
export default function App() {
  //statemanagement with useContext
  const [token, setToken] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState({
    name: "Select Playlist ....",
  });
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [logout, setLogout] = useState();
  const [mainImagePath, setMainImagePath] = useState(
    "https://media0.giphy.com/media/W2uuljh1kjzATbxfZG/source.gif"
  );
  const [trackInformation, setTrackInformation] = useState([]);
  const [playlistInformation, setPlaylistInformation] = useState({});
  const [allGenres, setAllGenres] = useState(genres.genres);
  const [chosenGenres, setChosenGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const globalSettings = {
    token: token,
    currentPlaylist: currentPlaylist,
    allPlaylists: allPlaylists,
    mainImagePath: mainImagePath,
    trackInformation: trackInformation,
    playlistInformation: playlistInformation,
    allGenres: allGenres,
    chosenGenres: chosenGenres,
    query: query,
    searchResults: searchResults,
    startYear: startYear,
    endYear: endYear,
    logout: logout,
    setLogout,
    setStartYear,
    setEndYear,
    setSearchResults,
    setQuery,
    setChosenGenres,
    setAllGenres,
    setPlaylistInformation,
    setTrackInformation,
    setToken,
    setAllPlaylists,
    setCurrentPlaylist,
    setMainImagePath,
  };

  return (
    <AppContext.Provider value={globalSettings}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Login} />
          <Stack.Screen name="Playlists" component={Playlists} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="SearchResults" component={SearchResults} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
