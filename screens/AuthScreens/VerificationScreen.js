import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const VerificationScreen = ({ navigation }) => {
    const [isVerified, setIsVerified] = useState(false);
    const user = auth().currentUser;

    useEffect(() => {
        const interval = setInterval(async () => {
            await user.reload(); // Kullanıcı bilgilerini güncelle
            if (user.emailVerified) {
                setIsVerified(true);
                clearInterval(interval);
                navigation.replace('HomeScreen'); // Ana ekrana yönlendir
            }
        }, 3000); // Her 3 saniyede bir doğrulamayı kontrol et

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101218' }}>
            <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
                Please verify your email to continue.
            </Text>
            <ActivityIndicator size="large" color="white" />
            <TouchableOpacity onPress={() => auth().signOut()} style={{ marginTop: 20 }}>
                <Text style={{ color: 'whiye', fontSize: 16 }}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerificationScreen;