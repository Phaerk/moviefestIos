import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStack from './homeStack'; // Home yerine HomeStack kullanacağız
import ProfileStack from './profileStack';

import RecommendationPage from '../screens/Recommend/RecommendationPage';
import ProfileScreen from '../screens/Profile/Profile';
import auth from '@react-native-firebase/auth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import RecStack from './recStack';

const Tab = createMaterialBottomTabNavigator();

const MyTabs = () => {
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = auth().currentUser;
      setUserChecked(!!user);
    };
    checkUser();
  }, []);

  if (!userChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      activeColor="white"
      inactiveColor="white"
      barStyle={{ backgroundColor: 'black' }}
      shifting={true}
      sceneAnimationEnabled={true}
      sceneAnimationType="shifting"
      theme={{ colors: { secondaryContainer: 'black' } }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RecStack') {
            iconName = focused ? 'gift-open' : 'gift-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'account' : 'account-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
    
       <Tab.Screen name="HomeStack" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="RecStack" component={RecStack} options={{ tabBarLabel: 'Recommend' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161618',
  },
});

export default MyTabs;