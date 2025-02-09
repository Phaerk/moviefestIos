import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/Profile';
import ProfileSettings from '../screens/Profile/settings/profileSettings';
import WatchedMovies from '../screens/Profile/settings/watchedMovies';
import LikedMovies from '../screens/Profile/settings/likedMovies';
import ChangePassword from '../screens/Profile/settings/changePassword/changePassword';
import SettingsScreen from '../screens/Profile/settings/settings/settings';
import MovieDetailsScreen from '../screens/Home/MovieDetails';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} options={{ title: 'Profile Settings' }} />
      <Stack.Screen name="WatchedMovies" component={WatchedMovies} options={{ title: 'Watched Movies' }} />
      <Stack.Screen name="LikedMovies" component={LikedMovies} options={{ title: 'Liked Movies' }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Change Password' }} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />      
    </Stack.Navigator>
  );
};

export default ProfileStack;