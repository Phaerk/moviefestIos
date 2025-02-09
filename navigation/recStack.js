import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecommendationPage from '../screens/Recommend/RecommendationPage';
import MovieDetailsScreen from '../screens/Home/MovieDetails';
import MovieDetailsRecommend from '../screens/Recommend/MovieDetailsRecommend';

const Stack = createStackNavigator();

const RecStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     <Stack.Screen name="RecommendationPage" component={RecommendationPage} options={{ title: 'Recommend Me A Film' }} />
     <Stack.Screen name="MovieDetailsRecommend" component={MovieDetailsRecommend} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
};

export default RecStack;