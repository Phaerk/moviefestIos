import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet, KeyboardAvoidingView, ScrollView, Platform,Keyboard } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Auth } from '../services';
import { Modal, Paragraph, Button, Portal, PaperProvider, MD2DarkTheme, MD2LightTheme } from 'react-native-paper';
import { ios, web } from '../../../files';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { appleAuth } from '@invertase/react-native-apple-authentication';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [modalTitle, setModalTitle] = useState('Email Verification Required');
  const [modalMessage,setModalMessage] = useState("Please check your email to verify your account. If you didn't receive it, you can resend.");
  const animationRef = useRef(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: web,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      iosClientId: ios,
    });
 
  }, []);

  useEffect(() => {
    setTimeout(() => {
      animationRef.current.pause(); // Animasyonu durdur
    }, 3800); // 2 saniye oynat, sonra durdur (isteğe bağlı süreyi değiştir)
  }, []);

  useEffect(() => {
    if (countdown > 1 && countdown < 60) {
      setModalMessage(`Please check your email to verify your account. If you didn't receive it, you can resend after ${countdown} seconds.`);
    } else if (countdown === 0) {
      setModalMessage("Please check your email to verify your account. If you didn't receive it, you can resend.");
    } else if (countdown === 60) {
      setModalMessage("Please check your email to verify your account. If you didn't receive it, you can resend.");
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    try {
      const user = auth().currentUser;
      if (user && !user.emailVerified) {
        setShowAnimation(true); // Show the animation when Resend is clicked
        await user.sendEmailVerification();
        setResendDisabled(true);
        setCountdown(60);
        setModalTitle('Email Verification Sent');
        
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev === 1) {
              clearInterval(interval);
              setResendDisabled(false);
              setShowAnimation(false); // Hide the animation once the process is done
            }
            return prev - 1;
          });
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending verification email:', error);
      setShowAnimation(false); // Hide animation in case of an error
    }
  };
  const handleLogin = async () => {
    // Temizle önceki hataları
    setEmailError('');
    setPasswordError('');
  
    try {
         
      if (!email || !password ) {
          if (!email) setEmailError('Email is required');
          if (!password) setPasswordError('Password is required');
              
          return;
      }
     
      
  
 
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;
      await userCredential.user.reload();
      // Firebase Authentication: Sign in
     
      if(!user.emailVerified){
        
        setModalVisible(true);
      }
      // Başarılı giriş sonrası yönlendirme işlemi
     
    } catch (Error) {
      // Eğer hata varsa, hata alert'i göster
      if (Error.code === 'auth/invalid-email') {
        setEmailError('Invalid email');
      } 
      else{
      
        setPasswordError('Email or Password is wrong')     }
    }
  };

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      idToken = signInResult.idToken;
    }

    if (!idToken) {
      throw new Error('No ID token found');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;

    const userRef = firestore().collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name: user.displayName,
        email: user.email,
        profileImageUrl: user.photoURL,
      });
    }

    return userCredential;
  }

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
  
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }
  
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    const userCredential = await auth().signInWithCredential(appleCredential);
    const user = userCredential.user;
    
    const userRef = firestore().collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name: user.displayName,
        email: user.email,
        profileImageUrl: user.photoURL,
      });
    }
  
    return userCredential;
  }



  return (
    <PaperProvider theme={theme}>
     <KeyboardAwareScrollView
           contentContainerStyle={{ flexGrow: 1 }}
           keyboardShouldPersistTaps="handled"
           style={{ flex: 1 ,backgroundColor:'#101218'}}
         >
      <View style={styles.container}>
          
         <LottieView
                         ref={animationRef}
                        source={require('../../../assets/animations/welcome3.json')} // Animasyon dosyanı buraya koy
                        autoPlay
                        loop={true}
                        speed={0.8}
                        style={{ width: 200, height: 200,marginTop: -100}}
                    />
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder='Enter your email'
            onChangeText={text => {
              setEmail(text);
              if (text) setEmailError(''); // Clear the error message when the user starts typing
          }}
            style={styles.textInput}
            placeholderTextColor="#b0aeae"
            onFocus={() => setEmailError('')}
          />
          
          <View style={styles.separator} />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : <Text style={styles.noemailError}>{emailError}</Text>}
        </View >
        <View style={styles.space}></View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder='Enter your password'
            onChangeText={text => {
              setPassword(text);
              if (text) setPasswordError(''); // Clear the error message when the user starts typing
          }}
            style={styles.textInput}
            secureTextEntry={true}
            placeholderTextColor="#b0aeae"
            onFocus={() => setPasswordError('')}
          />
          
          <View style={styles.separator} />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : <Text style={styles.noemailError}>{passwordError}</Text>}
        </View>
        
       

        <TouchableOpacity   onPress={() => {
            Keyboard.dismiss();  // This will hide the keyboard
            handleLogin();     // Then call your sign-up logic
          }}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>Create account</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
  <View style={styles.separatorLine} />
  <Text style={styles.separatorText}>or sign in with</Text>
  <View style={styles.separatorLine} />
</View>

            <View style={styles.googleButtonContainer}>
          <TouchableOpacity onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}>
            <View style={styles.googleButton}>
              <Icon name="google" size={30} color="white" style={styles.googleIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}>
            <View style={styles.googleButton}>
              <Icon name="apple" size={30} color="white" style={styles.googleIcon} />
            </View>
          </TouchableOpacity>
        </View>
        
        <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={modalStyles.modalContainer}
            >
              {showAnimation && (
                <LottieView
                  source={require('../../../assets/animations/mailSent2.json')}
                  autoPlay
                  loop={false}
                  style={{ width: 120, height: 120 }}
                />
              )}
              <Text style={modalStyles.modalTitle}>{modalTitle}</Text>
              <Text style={modalStyles.modalMessage}>
                {modalMessage}
              </Text>
              <View style={modalStyles.buttonContainer}>
                <Button
                  mode="contained"
                  disabled={resendDisabled}
                  onPress={handleResendVerification}
                  style={[modalStyles.resendButton, resendDisabled && modalStyles.disabledButton]}
                  labelStyle={{ color: 'white' }}
                >
                  {resendDisabled ? `Resend (${countdown}s)` : 'Resend'}
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                              setModalVisible(false);
                              Auth.signOut();
                           
                          }}
                  style={modalStyles.okButton}
                  labelStyle={{ color: 'white' }}
                >
                  OK
                </Button>
              </View>
            </Modal>
          </Portal>
      </View>
               
                </KeyboardAwareScrollView>
    </PaperProvider>
  );
};

const theme = {
  ...MD2DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    surface: '#4e8d7c',
    primary: 'white',
    accent: '#1f319d',
    text: '#fff',
    onSurface: '#f3ce13',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

const modalStyles = StyleSheet.create({
  modalContainer: {
      backgroundColor: '#222831',
      padding: 20, 
      margin: 20,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
  },
  modalMessage: {
      fontSize: 14,
      color: '#d3d3d3',
      textAlign: 'center',
      marginBottom: 30,
  },
  buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
  },
  resendButton: {
      alignSelf: 'flex-start',
      borderRadius: 10,
      backgroundColor:'#224060',
      shadowColor: '#000',
      shadowOpacity: 0.7,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5, // Android için gölge
  },
  okButton: {
      alignSelf: 'flex-end',
      backgroundColor:'#019159',
    
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.7,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5, // Android için gölge
      
  },
  disabledButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    opacity: 0.6,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5, // Android için gölge
  },
});

export default Login;