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
    
            if (user.isAnonymous) {
                setUser(user); // Anonim kullanıcıyı kabul et
                setIntervalCleared(true); // Interval'i temizle
            } else if (user.providerData && (user.providerData[0].providerId === 'google.com' || user.providerData[0].providerId === 'apple.com')) {
                setUser(user); // Google/Apple girişini kabul et
                if (!intervalCleared) {
                    setIntervalCleared(true);
                }
            } else {
                if (user.emailVerified) {
                    setUser(user); // Yalnızca email doğrulanmışsa kullanıcıyı kabul et
                    if (!intervalCleared) {
                        setIntervalCleared(true);
                    }
                } else {
                    setUser(null); // Email doğrulanmadıysa kullanıcıyı null yap
                    if (intervalCleared) {
                        setIntervalCleared(false);
                    }
                }
            }
        } else {
            setUser(null); // Kullanıcı çıkış yaptıysa
            if (intervalCleared) {
                setIntervalCleared(false);
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