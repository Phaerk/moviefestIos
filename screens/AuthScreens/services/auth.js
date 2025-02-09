import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { ios,web } from '../../../files';

// GoogleSignin yapılandırmasını güncelle
  GoogleSignin.configure({
         webClientId: web,
        
         offlineAccess: true,
         forceCodeForRefreshToken: true,
         iosClientId: ios,
       });
const signUp = async (fullname, email, password) => {
    if (!fullname || !email || !password) {
        throw new Error('Please fill in all fields.');
    }

    try {
        const cred = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const { uid } = cred.user;
        await auth().currentUser.updateProfile({ displayName: fullname });
        return uid;
    } catch (err) {
        throw new Error(err.message);
    }
};

const signIn = async (email, password) => {
    if (!email || !password) {
        throw new Error('Please enter both email and password.');
    }

    try {
        await auth().signInWithEmailAndPassword(email.trim(), password);
        return auth().currentUser.uid;
    } catch (err) {
        throw new Error(err.message);
    }
};

const signOut = async () => {
    const user = auth().currentUser;

    if (user && user.providerData.some(provider => provider.providerId === 'google.com')) {
        // Google ile giriş yapılmışsa Google oturumunu kapat
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error('Error signing out from Google:', error);
        }
    }

    // Firebase oturumunu kapat
    return auth().signOut();
};

const Auth = {
    signUp,
    signIn,
    signOut
};

export default Auth;
