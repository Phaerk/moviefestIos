import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,SafeAreaView,  } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Auth } from '../../../AuthScreens/services';


import { Dialog, Paragraph, Button, Portal, PaperProvider, MD2DarkTheme,Modal } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './style';
import LottieView from 'lottie-react-native';



const SettingsScreen = () => {
    const navigation = useNavigation();
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [isAppleUser, setIsAppleUser] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalReqVisible, setModalReqVisible] = useState(false);
    const [modalLogVisible, setModalLogVisible] = useState(false);
    
  

    useEffect(() => {
       
        const user = auth().currentUser;
        if (user && user.providerData[0].providerId === 'google.com') {
            setIsGoogleUser(true);
        }else if (user && user.providerData[0].providerId === 'apple.com') {
            setIsAppleUser(true);
        }else{
            setIsAppleUser(false);
            setIsGoogleUser(false);
        }

        
    }, []);






    const handleLogout = () => {
        Auth.signOut();
    };

    const handleDeleteAccount = async () => {
        
            try {
                await firestore().collection('users').doc(auth().currentUser.uid).delete();
                await auth().currentUser.delete();
            } catch (error) {
                if (error.code === 'auth/requires-recent-login') {
                    
                    setModalReqVisible(true);
                } 
                console.error('Error deleting account:', error);
            }
       
    };

   
    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                   <MaterialIcon name="arrow-back-ios-new" size={27} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{"Settings"}</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{"Preferences"}</Text>
                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ProfileSettings')}>
                    <MaterialCommunityIcon name="account" size={24} color="white" />
                        <Text  style={styles.optionText}>{"Profile Settings"}</Text>
                        <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('WatchedMovies')}>
                    <MaterialCommunityIcon name="bookmark-check" size={24} color="white" />
                        <Text style={styles.optionText}>{"Watched Movies"}</Text>
                        <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('LikedMovies')}>
                    <MaterialCommunityIcon name="thumb-up" size={24} color="white" />
                        <Text style={styles.optionText}>{"Liked Movies"}</Text>
                        <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                    </TouchableOpacity>
                    
                    
                   
                </View>


                


                    
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{"Account"}</Text>
                    {!(isGoogleUser || isAppleUser) && (
                        <>
                            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
                            <MaterialCommunityIcon name="account-key" size={24} color="white" />
                                <Text style={styles.optionText}>{"Change Password"}</Text>
                                <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                            </TouchableOpacity>
                            
                        </>
                    )}
                 <TouchableOpacity style={styles.option} onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcon name="account-minus" size={24} color="white" />
                               <Text style={styles.optionText}>{"Delete Account"}</Text>
                        <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.option} onPress={() => setModalLogVisible(true)}>
                    <LottieView
                                    source={require('../../../../assets/animations/logout.json')}
                                    autoPlay
                                    loop={false}
                                    speed={0.5} 
                                    style={modalStyles.animation}
                                  />
                        <Text style={styles.optionText }>{"Log Out"}</Text>
                        <MaterialIcon name="arrow-forward-ios" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                
               <Portal>
                           <Modal
                             visible={modalVisible}
                             onDismiss={() => setModalVisible(false)}
                             contentContainerStyle={modalStyles.modalContainer}
                           >
                         
                             <Text style={modalStyles.modalTitle}>Delete Account</Text>
                             <Text style={modalStyles.modalMessage}>
                             Are you sure you want to delete your account?
                             </Text>
                             <View style={modalStyles.buttonContainer}>
                               <Button
                                 mode="contained"
                                
                                 onPress={() => setModalVisible(false)}
                                 style={modalStyles.resendButton}
                                 labelStyle={{ color: 'white' }}
                               >
                              Cancel
                               </Button>
                               <Button
                                 mode="contained"
                                 onPress={() => {
                                    handleDeleteAccount();
                                    setModalVisible(false); // Close modal after deletion
                                  }}
                                 style={modalStyles.okButton}
                                 labelStyle={{ color: 'white' }}
                               >
                                 Delete
                               </Button>
                             </View>
                           </Modal>
                         </Portal>
                         <Portal>
                           <Modal
                             visible={modalReqVisible}
                             onDismiss={() => setModalReqVisible(false)}
                             contentContainerStyle={modalStyles.modalContainer}
                           >
                           
                         
                             <Text style={modalStyles.modalTitle}>Delete Account</Text>
                             <Text style={modalStyles.modalMessage}>
                             Please sign in again to continue with account deletion.
                             </Text>
                             <View style={modalStyles.buttonContainer}>
                               <Button
                                 mode="contained"
                                
                                 onPress={() => setModalReqVisible(false)}
                                 style={modalStyles.resendButton}
                                 labelStyle={{ color: 'white' }}
                               >
                              Cancel
                               </Button>
                               <Button
                                 mode="contained"
                                 onPress={() => {
                                    handleLogout();
                                    setModalReqVisible(false); // Close modal after deletion
                                  }}
                                 style={modalStyles.okButton}
                                 labelStyle={{ color: 'white' }}
                               >
                                 Sign in
                               </Button>
                             </View>
                           </Modal>
                         </Portal>
                         <Portal>
                           <Modal
                             visible={modalLogVisible}
                             onDismiss={() => setModalLogVisible(false)}
                             contentContainerStyle={modalStyles.modalContainer}
                           >
                            <View style={modalStyles.modalContent}>
                              <LottieView
                                    source={require('../../../../assets/animations/logout.json')}
                                    autoPlay
                                    loop={false}
                                    speed={0.5} 
                                    style={modalStyles.animation}
                                  />
                         
                             <Text style={modalStyles.modalTitle}>Log Out</Text>
                             <Text style={modalStyles.modalMessage}>
                             Are you sure you want to log out?
                             </Text>
                             <View style={modalStyles.buttonContainer}>
                               <Button
                                 mode="contained"
                                
                                 onPress={() => setModalLogVisible(false)}
                                 style={modalStyles.resendButton}
                                 labelStyle={{ color: 'white' }}
                               >
                              Cancel
                               </Button>
                               <Button
                                 mode="contained"
                                 onPress={() => {
                                    handleLogout();
                                    setModalLogVisible(false); // Close modal after deletion
                                  }}
                                 style={modalStyles.okButton}
                                 labelStyle={{ color: 'white' }}
                               >
                                 Log Out
                               </Button>
                             </View>
                             </View>
                           </Modal>
                         </Portal>
            </SafeAreaView>
        </PaperProvider>
    );
};


const theme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        surface: '#101218',
        primary: 'white',
        accent: '#d9534f',
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
    animation: {
        width: 25,
        height: 30,
        

      },
      modalContent: {
        alignItems: 'center',
        width: '100%',
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
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5, // Android için gölge
        backgroundColor:'#224060',
    
    },
    okButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#E57373',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5, // Android için gölge
    },
  });



export default SettingsScreen;