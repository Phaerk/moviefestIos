import React from "react";
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from "../screens/Home/Home";
import MovieDetailsScreen from "../screens/Home/MovieDetails";
import RecommendationPage from "../screens/Recommend/RecommendationPage";
import MovieDetailsRecommend from "../screens/Recommend/MovieDetailsRecommend";
import ProfileScreen from "../screens/Profile/Profile";
import SettingsScreen from "../screens/Profile/settings/settings/settings";
import ProfileSettings from "../screens/Profile/settings/profileSettings";
import WatchedMovies from "../screens/Profile/settings/watchedMovies";
import LikedMovies from "../screens/Profile/settings/likedMovies";

import ChangePassword from "../screens/Profile/settings/changePassword/changePassword";


import MyTabs from "./paper";
import { Modal } from "react-native-paper";




const Stack = createStackNavigator();

const Mainnav = () => {
    return (
        <Stack.Navigator
  
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.FadeFromBottomAndroid,
                 
            }}
         
        >
            <Stack.Screen name='MainTabs' component={MyTabs} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
            <Stack.Screen name="RecommendationPage" component={RecommendationPage} options={{ title: 'Recommend Me A Film' }} />
            <Stack.Screen name="MovieDetailsRecommend" component={MovieDetailsRecommend} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettings} options={{ title: 'Profile Settings' }} />
            <Stack.Screen name="WatchedMovies" component={WatchedMovies} options={{ title: 'Watched Movies' }} />
            <Stack.Screen name="LikedMovies" component={LikedMovies} options={{ title: 'Liked Movies' }} />
           
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Change Password' }} />
            
        </Stack.Navigator>
    );
}

export default Mainnav;
