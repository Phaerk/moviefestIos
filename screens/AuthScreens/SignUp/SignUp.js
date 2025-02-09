import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform,Keyboard  } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { PaperProvider, MD2DarkTheme, Modal, Portal, Button } from 'react-native-paper';
import styles from './style';
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth } from '../services';

const theme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        surface: 'white',
        primary: 'white',
        accent: '#d9534f',
        text: 'white',
        onSurface: 'white',
        backdrop: 'rgba(0, 0, 0, 0.5)',
    },
};

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    const [modalMessage,setModalMessage] = useState("Please check your email to verify your account. If you didn't receive it, you can resend.");
  
    useEffect(() => {
        if (countdown > 1 && countdown < 60) {
            setModalMessage(
              <Text>
                Please check your email to verify your account. If you didn't receive it, you can resend after{' '}
                <Text style={modalStyles.highlighted}>{countdown}</Text> sec.
              </Text>
            );
          }else if (countdown === 0) {
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

    const handleSignUp = async () => {
        try {
            setEmailError('');
            setPasswordError('');
            setNameError('');

            if (!email || !password || !name) {
                if (!email) setEmailError('Email is required');
                if (!password) setPasswordError('Password is required');
                if (!name) setNameError('Name is required');
                return;
            }

            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            
            
            await firestore().collection('users').doc(user.uid).set({
                name,
                email,
                
            });
            handleResendVerification();
            // Başarılı kayıt sonrası modalı aç
            setModalVisible(true);
            
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setEmailError('Invalid email address');
            } else if (error.code === 'auth/weak-password') {
                setPasswordError('Password must be at least 6 characters long');
            } else if (error.code === 'auth/email-already-in-use') {
                setEmailError('Email is already in use');
            } else {
                console.error(error);
            }
        }
    };

    return (
        <PaperProvider theme={theme}>
           <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 ,backgroundColor:'#101218'}}
    >
               
                    <View style={styles.container}>
                        <Text style={styles.title}>Create Account</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                placeholder='Enter your name (or username)'
                                onChangeText={text => {
                                    setName(text);
                                    if (text) setNameError('');
                                }}
                                style={styles.textInput}
                                placeholderTextColor="#b0aeae"
                                onFocus={() => setNameError('')} 
                            />
                            <View style={styles.separator} />
                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : <Text style={styles.noemailError}>{emailError}</Text>}
                        </View>
                        <View style={styles.space}></View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                placeholder='Enter your email'
                                onChangeText={text => {
                                    setEmail(text);
                                    if (text) setEmailError('');
                                }}
                                style={styles.textInput}
                                placeholderTextColor="#b0aeae"
                                onFocus={() => setEmailError('')} 
                            />
                            <View style={styles.separator} />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : <Text style={styles.noemailError}>{emailError}</Text>}
                        </View>
                        <View style={styles.space}></View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                placeholder='Enter your password'
                                onChangeText={text => {
                                    setPassword(text);
                                    if (text) setPasswordError('');
                                }}
                                style={styles.textInput}
                                secureTextEntry={true}
                                placeholderTextColor="#b0aeae"
                                onFocus={() => setPasswordError('')} 
                            />
                            <View style={styles.separator} />
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : <Text style={styles.noemailError}>{emailError}</Text>}
                        </View>
                        <TouchableOpacity
  onPress={() => {
    Keyboard.dismiss();  // This will hide the keyboard
    handleSignUp();     // Then call your sign-up logic
  }}
>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signupText}>Have an account? Login</Text>
                        </TouchableOpacity>
                    </View>
                

                {/* Modal */}
                <Portal>
    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={modalStyles.modalContainer}>
     {showAnimation && (
                   <LottieView
                     source={require('../../../assets/animations/mailSent2.json')}
                     autoPlay
                     loop={false}
                     style={{ width: 120, height: 120 }}
                   />
                 )}
        <Text style={modalStyles.modalTitle}>Email Verification Sent</Text>
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
                                      navigation.navigate('Login');
                                   
                                  }}
                          style={modalStyles.okButton}
                          labelStyle={{ color: 'white' }}
                        >
                          OK
                        </Button>
                      </View>

    </Modal>
</Portal>
</KeyboardAwareScrollView>
        </PaperProvider>
    );
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
   
        lineHeight: 20,
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
    highlighted:{
        fontWeight: 'bold',
        color: 'white',
      },
});

export default SignUp;