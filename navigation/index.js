import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import Mainnav from "./navigator";
import AuthNavigator from "./authNavigator";

const AppContainer = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [intervalCleared, setIntervalCleared] = useState(false);

    async function onAuthStateChange(user) {
        if (user) {
            await user.reload(); // Update user info
            // Skip emailVerified check for Google/Apple logins
            if (user.providerData && (user.providerData[0].providerId === 'google.com' || user.providerData[0].providerId === 'apple.com')) {
                setUser(user); // If logged in with Google/Apple, set user without email verification check
                if (!intervalCleared) {
                    setIntervalCleared(true); // Stop checking email verification
                }
            } else {
                if (user.emailVerified) {
                    setUser(user); // Only set the user if email is verified
                    if (!intervalCleared) {
                        setIntervalCleared(true); // Stop checking email verification
                    }
                } else {
                    setUser(null); // Otherwise, set user as null
                    if (intervalCleared) {
                        setIntervalCleared(false); // Reset interval check when user logs out
                    }
                }
            }
        } else {
            setUser(null); // If no user is logged in
            if (intervalCleared) {
                setIntervalCleared(false); // Reset interval check when user logs out
            }
        }
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(onAuthStateChange);

        // Only create interval if not Google/Apple login or email is not verified
        let interval;
        if (!intervalCleared) {
            interval = setInterval(async () => {
                const currentUser = auth().currentUser;
                if (currentUser) {
                    await currentUser.reload();
                    if (currentUser.emailVerified) {
                        setUser(currentUser);
                    }
                }
            }, 2000); // Check every second
        }

        return () => {
            unsubscribe();
            if (interval) clearInterval(interval); // Clear interval if it's active
        };
    }, [intervalCleared]);

    if (initializing) return null;

    return (
        <NavigationContainer>
            {user ? <Mainnav /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppContainer;