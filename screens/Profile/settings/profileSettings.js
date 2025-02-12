import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, SafeAreaView,Keyboard } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dialog, Paragraph, Button, Portal, PaperProvider, MD2DarkTheme,Modal } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { Auth } from '../../AuthScreens/services';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import profile from '../../../assets/profile_images/profile_.png';

const theme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        surface: 'black',
        primary: '#f3ce13',
        accent: '#d9534f',
        text: '#fff',
        onSurface: '#f3ce13',
        backdrop: 'rgba(0, 0, 0, 0.5)',
    },
};

const ProfileSettings = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [newName,setNewName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(() => () => {});
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAnon, setIsAnon] = useState(false);
    const [anonModalVisible, setAnonModalVisible] = useState(false);

    const user = auth().currentUser;
    const imageSource = profileImageUrl ? { uri: profileImageUrl } : profile;

    useEffect(() => {
        if (user) {
            if (user.isAnonymous) {
                setIsAnon(true);
            }
            const userId = user.uid;
            const unsubscribe = firestore().collection('users').doc(userId).onSnapshot((docSnapshot) => {
                if (docSnapshot.exists) {
                    const userData = docSnapshot.data();
                    setName(userData.name || user.displayName);
                    setProfileImageUrl(userData.profileImageUrl || user.photoURL);
                } else {
                    setName(user.displayName);
                    setProfileImageUrl(user.photoURL);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);
    const handleLogout = () => {
        Auth.signOut();
    };
    const handleSave = async () => {
        if (isAnon) {
            setAnonModalVisible(true);
            return;
        }

        try {
            const userRef = firestore().collection('users').doc(user.uid);
            await userRef.update({
                name: newName || name, // Eğer kullanıcı yeni bir isim girdiyse onu kaydet, yoksa eski ismi koru
                profileImageUrl
            });
            setModalVisible(true);
        } catch (error) {
            console.error('Error updating profile:', error);
        
        }
    };

    const handleSelectPhoto = () => {
        if (isAnon) {
            setAnonModalVisible(true);
            return;
        }

        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets.length > 0) {
                const source = response.assets[0];
                const uploadUri = Platform.OS === 'ios' ? source.uri.replace('file://', '') : source.uri;
                await uploadImage(uploadUri);
            }
        });
    };

    const showAlert = (title, message) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setDialogVisible(true);
    };

    const uploadImage = async (uri) => {
        setUploading(true);
        const storageRef = storage().ref(`profile_pictures/${user.uid}`);
        try {
            await storageRef.putFile(uri);
            const url = await storageRef.getDownloadURL();
            await firestore().collection('users').doc(user.uid).update({ profileImageUrl: url });
            setProfileImageUrl(url);
        } catch (error) {
            console.error('Error uploading image:', error);
            showAlert('Error', 'There was an error uploading your profile picture.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={styles.loader} />;
    }

    return (
        <PaperProvider theme={theme}>
              <KeyboardAwareScrollView
                                 contentContainerStyle={{ flexGrow: 1 }}
                                 keyboardShouldPersistTaps="handled"
                                 style={{ flex: 1 ,backgroundColor:'#101218'}}
                               >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcon name="arrow-back-ios" size={27} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{"Profile Settings"}</Text>
               
                <View style={styles.form}>
                    <Text style={styles.label}>{"Edit Name"}</Text>
                    <TextInput
    style={styles.input}
   
    onChangeText={text => {
        setNewName(text);
       
    }}
    placeholder={"Enter name"}
    placeholderTextColor="#888"
/>

                    <Text style={styles.label}>{"Edit Profile Photo"}</Text>

                    <Image source={imageSource} style={styles.profilePhoto} /> 
                    {uploading && <ActivityIndicator size="large" color="white" style={styles.loader} />}
                    {name && <Text style={styles.currentName}>{name}</Text>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.photoButton} onPress={() => {
                            Keyboard.dismiss();  // This will hide the keyboard
                            handleSelectPhoto();     // Then call your sign-up logic
                          }}>
                            <Text style={styles.photoButtonText}>{"Select Photo"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={() => {
                            Keyboard.dismiss();  // This will hide the keyboard
                            handleSave();     // Then call your sign-up logic
                          }} disabled={uploading}>
                            <Text style={styles.saveButtonText}>{"Save"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                  <Portal>
                  <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={modalStyles.modalContainer}
                  >
                    <View style={modalStyles.modalContent}>
                      <LottieView
                        source={require('../../../assets/animations/success.json')}
                        autoPlay
                        loop={false}
                        style={modalStyles.animation}
                      />
                
                      <Text style={modalStyles.modalTitle}>Profile Updated</Text>
                      <Text style={modalStyles.modalMessage}>
                      Your profile has been updated successfully.
                      </Text>
                
                      <Button
                        mode="contained"
                        onPress={() => {
                          setModalVisible(false);
                          navigation.goBack();
                        }}
                        style={modalStyles.okButton}
                        labelStyle={modalStyles.okButtonLabel}
                      >
                        OK
                      </Button>
                    </View>
                  </Modal>
                </Portal>
                <Portal>
                    <Modal
                        visible={anonModalVisible}
                        onDismiss={() => setAnonModalVisible(false)}
                        contentContainerStyle={modalStyles.modalContainer}
                    >
                        <View style={modalStyles.modalContent}>
                            <LottieView
                                source={require('../../../assets/animations/warn.json')}
                                autoPlay
                                loop={false}
                                style={modalStyles.animation}
                            />
                            <Text style={modalStyles.modalTitle}>Need Sign-in</Text>
                            <Text style={modalStyles.modalMessage}>
                            As an anonymous user, you are unable to access personalized features. Please sign-in to unlock these features.
                            </Text>
                            <View style={modalStyles.buttonContainer}>
                            <Button
                                mode="contained"
                                onPress={() => setAnonModalVisible(false)}
                                style={modalStyles.resendButton}
                                labelStyle={modalStyles.okButtonLabel}
                            >
                                BACK
                            </Button>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    handleLogout();
                                    setAnonModalVisible(false); // Close modal after deletion
                                    }}
                                style={modalStyles.okButton}
                                labelStyle={{ color: 'white' }}
                                >
                                    Sign in
                            </Button>
                            </View>
                            
                        </View>
                    </Modal>
                </Portal>
            </SafeAreaView>
            </KeyboardAwareScrollView>
        </PaperProvider>
    );
};

const modalStyles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#222831',
      padding: 24,
      marginHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    modalContent: {
      alignItems: 'center',
      width: '100%',
    },
    animation: {
      width: 120,
      height: 120,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: 'white',
      marginBottom: 6,
    },
    modalMessage: {
      fontSize: 14,
       color: '#d3d3d3',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    okButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#019159',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5, // Android için gölge
    },
    okButtonLabel: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
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
    modalContent: {
        alignItems: 'center',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
  });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: 15,
        paddingInlineStart:10,
        paddingInlineEnd:10,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        bottom:hp(1.5),
    },
    form: {
        marginTop: 20,
    },
    label: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#3F4454',
        color: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 25,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    photoButton: {
        backgroundColor: '#3F4454',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#3F4454',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    backButton: {
        padding: wp(1.276),
        borderRadius: 5,
        top: hp(2.56),
        left: wp(2),
        zIndex: 1,
    },
    backButtonIcon: {
        width: wp(7.656),
        height: wp(7),
    },
    dialogTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    dialogMessage: {
        color: 'white',
    },
    confirmButton: {
        backgroundColor: 'white',
        marginLeft: 10,
    },
    confirmButtonText: {
        color: 'black',
        paddingHorizontal: 20,
    },
    loader: {
        marginBottom: 20,
    },
    currentName: {
        fontSize: 15, // Biraz daha büyük yaparak okunaklı hale getirildi
        color: 'white', // Daha yumuşak bir gri tonu
        fontWeight: '500', // Orta kalınlıkta font, daha dengeli görünüm sağlar
        textAlign: 'center', // Yazının sola hizalanmasını sağlar
        marginTop: -10,
        marginBottom: 10,
        fontWeight:'bold',
        fontFamily:'Helvatica',
            },
            
});

export default ProfileSettings;