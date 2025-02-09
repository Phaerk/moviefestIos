import React from "react";
import {createStackNavigator } from '@react-navigation/stack';
import Login from "../screens/AuthScreens/Login/Login";
import SignUp from "../screens/AuthScreens/SignUp/SignUp";
import VerificationScreen from "../screens/AuthScreens/VerificationScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return(
        <Stack.Navigator initialRouteName = 'Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='SignUp' component={SignUp} />
            <Stack.Screen name='VerificationScreen' component={VerificationScreen} />

        </Stack.Navigator>
    )
}

export default AuthNavigator;
