import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';


const WelcomeAnimation = () => {
    const [firstTime, setFirstTime] = useState(false);

    useEffect(() => {
        const checkFirstTime = async () => {
            const user = auth().currentUser;
            if (!user) return;

            const userDocRef = firestore().collection('users').doc(user.uid);
            const doc = await userDocRef.get();

            if (!doc.exists || !doc.data()?.hasSeenAnimation) {
                setFirstTime(true);

                setTimeout(() => {
                    setFirstTime(false);
                }, 5000);

                await userDocRef.set({ hasSeenAnimation: true }, { merge: true });
            }
        };

        checkFirstTime();
    }, []);

    if (!firstTime) return null;

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 20,
            }}
        >
            <LottieView
                source={require('../../assets/animations/swiperight2.json')} // Animasyon dosyanı buraya koy
                autoPlay
                loop
                speed={0.8}
                style={{ width: 300, height: 300,paddingTop:30 }}
            />
        </View>
    );
};

export default WelcomeAnimation;