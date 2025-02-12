import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Platform, Alert,SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

import { Auth } from '../AuthScreens/services';
import { Dialog, Paragraph, Button, Portal, PaperProvider, MD2DarkTheme ,Modal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import profile from '../../assets/profile_images/profile_.png';





const API_KEY = 'f6de70a4a82aec4b70272b422861c7f1';
const API_URL = 'https://api.themoviedb.org/3';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState(null);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [name, setName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(() => () => {});
    const [modalLogVisible, setModalLogVisible] = useState(false);
    const [isAnon, setIsAnon] = useState(false);
    const [anonModalVisible, setAnonModalVisible] = useState(false);
   

    const user = auth().currentUser;
    const imageSource = profileImageUrl ? { uri: profileImageUrl } : profile;

  


    useEffect(() => {
        if (user) {
            if (user.isAnonymous) {
                setIsAnon(true);
            }
            fetchUserProfile();
            fetchFavoriteMovies(true);
            fetchWatchedMovies(true);
            
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
             
                fetchUserProfile(); // User profile re-fetch when the screen is focused
                fetchFavoriteMovies(true); // Force re-fetch when the screen is focused
                fetchWatchedMovies(true); 
                 // Force re-fetch when the screen is focused
                
            }
        }, [user])
    );

    

    

    

    const showAlert = (title, message, onConfirmAction) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setOnConfirm(() => onConfirmAction);
        setDialogVisible(true);
    };

    const fetchUserProfile = async () => {
        try {
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                setName(userData.name);
                setProfileImageUrl(userData.profileImageUrl || user.photoURL);
            } else {
                setName(user.displayName);
                setProfileImageUrl(user.photoURL);
            }
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavoriteMovies = async (forceUpdate = false) => {
        if (!forceUpdate && favoriteMovies.length > 0) return; // Avoid re-fetching if not necessary

        try {
            const userFavoritesSnapshot = await firestore().collection('users').doc(user.uid).collection('favorites').get();
            const favoriteMoviesIds = userFavoritesSnapshot.docs.map(doc => doc.id); // Get only movie IDs
            const favoriteMovies = await fetchMoviesData(favoriteMoviesIds); // Fetch movie details from API
            setFavoriteMovies(favoriteMovies.filter(movie => movie)); // Filter out null values
        } catch (error) {
            console.error('Error fetching favorite movies:', error);
        }
    };

    const fetchWatchedMovies = async (forceUpdate = false) => {
        if (!forceUpdate && watchedMovies.length > 0) return; // Avoid re-fetching if not necessary

        try {
            const userWatchedSnapshot = await firestore().collection('users').doc(user.uid).collection('watched').get();
            const watchedMoviesIds = userWatchedSnapshot.docs.map(doc => doc.id); // Get only movie IDs
            const watchedMovies = await fetchMoviesData(watchedMoviesIds); // Fetch movie details from API
            setWatchedMovies(watchedMovies.filter(movie => movie)); // Filter out null values
        } catch (error) {
            console.error('Error fetching watched movies:', error);
        }
    };

    const fetchMoviesData = async (movieIds) => {
        try {
            const moviesDataPromises = movieIds.map(async (movieId) => {
                const response = await axios.get(`${API_URL}/movie/${movieId}`, {
                    params: {
                        api_key: API_KEY,
                      
                    },
                });
                return response.data;
            });
            const moviesData = await Promise.all(moviesDataPromises);
            return moviesData;
        } catch (error) {
            console.error('Error fetching movies data:', error);
            return [];
        }
    };

    const handleImagePicker = () => {
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

    const uploadImage = async (uri) => {
        setLoading(true);
        console.log("Uploading image with URI: ", uri);  // Log to check the URI
        const storageRef = storage().ref(`profile_pictures/${user.uid}`);
        try {
            await storageRef.putFile(uri);
            const url = await storageRef.getDownloadURL();
            await firestore().collection('users').doc(user.uid).update({ profileImageUrl: url });
            setProfileImageUrl(url);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavoriteMovie = async (movieId) => {
        setFavoriteMovies((prevMovies) => prevMovies.filter(movie => movie.id !== movieId)); // Optimistic update

        try {
            await firestore().collection('users').doc(user.uid).collection('favorites').doc(movieId).delete();
        } catch (error) {
            console.error('Error removing favorite movie:', error);
            // Optionally, you can revert the state update if the API call fails
            fetchFavoriteMovies(true);
        }
    };

    const removeWatchedMovie = async (movieId) => {
        setWatchedMovies((prevMovies) => prevMovies.filter(movie => movie.id !== movieId)); // Optimistic update

        try {
            await firestore().collection('users').doc(user.uid).collection('watched').doc(movieId).delete();
        } catch (error) {
            console.error('Error removing watched movie:', error);
            // Optionally, you can revert the state update if the API call fails
            fetchWatchedMovies(true);
        }
    };

    const renderMovieItem = ({ item, onRemove }) => {
        const title = item.title.length > 18 ? item.title.substring(0, 18) + "..." : item.title;
        return (
            <TouchableOpacity onPress={() => handlePosterClick(item.id)}>
                <View style={styles.movieContainer}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} style={styles.moviePoster} />
                    <Text style={styles.movieTitle}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handlePosterClick = (item) => {
    
        navigation.navigate('MovieDetails', { movieId: item });
    };


   const handleLogout = () => {
          Auth.signOut();
      };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
         <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
                <Icon name="settings" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButtonRight} onPress={() => setModalLogVisible(true)}>
            <Icon name="logout" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={handleImagePicker}>
                <Image 
            source={imageSource} 
            style={styles.profileImage} 
        />
                </TouchableOpacity>
                <Text style={styles.profileName}>{name}</Text>
            </View>
           
            <Text style={styles.sectionTitle}>{'Liked Movies'}</Text>
            {favoriteMovies.length === 0 ? (
                <Text style={styles.noMoviesText}>{'No liked movies added yet.'}</Text>
            ) : (
            <FlatList
                data={favoriteMovies}
                renderItem={(item) => renderMovieItem(item, removeFavoriteMovie)}
                keyExtractor={(item) => item.id.toString()}
                horizontal
            />  )}
             
             <Text style={styles.sectionTitle}>{'Watched Movies'}</Text>
            {watchedMovies.length === 0 ? (
                <Text style={styles.noMoviesText}>{'No watched movies added yet.'}</Text>
            ) : (
            <FlatList
                data={watchedMovies}
                renderItem={(item) => renderMovieItem(item, removeWatchedMovie)}
                keyExtractor={(item) => item.id.toString()}
                horizontal
            />)}
             
           
             <Portal>
                           <Modal
                             visible={modalLogVisible}
                             onDismiss={() => setModalLogVisible(false)}
                             contentContainerStyle={modalStyles.modalContainer}
                           >
                            <View style={modalStyles.modalContent}>
                              <LottieView
                                    source={require('../../assets/animations/logout.json')}
                                    autoPlay
                                    loop={false}
                                    speed={0.5} 
                                    style={modalStyles.animation}
                                  />
                         
                             <Text style={modalStyles.modalTitle}>Log Out</Text>
                             <Text style={modalStyles.modalMessage}>
                            Are you sure to log out?
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
                          <Portal>
                                             <Modal
                                                 visible={anonModalVisible}
                                                 onDismiss={() => setAnonModalVisible(false)}
                                                 contentContainerStyle={modalStyles.modalContainer}
                                             >
                                                 <View style={modalStyles.modalContent}>
                                                     <LottieView
                                                         source={require('../../assets/animations/warn.json')}
                                                         autoPlay
                                                         loop={false}
                                                         style={modalStyles.animation2}
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
                                                                                    style={modalStyles.okButton2}
                                                                                    labelStyle={{ color: 'white' }}
                                                                                  >
                                                                                    Sign in
                                                                                  </Button>
                                                                                  </View>
                                                     
                                                 </View>
                                             </Modal>
                                         </Portal>
            <View height={10}></View>
        </ScrollView>
        </SafeAreaView>
        </PaperProvider>
    );
};

const theme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        surface: 'black', // Arka plan rengi
        primary: 'white', // Ana buton rengi
        accent: '#d9534f', // Vurgulayıcı renk
        text: '#fff', // Metin rengi
        onSurface: 'white', // Üzerinde metin rengi
        backdrop: 'rgba(0, 0, 0, 0.5)', // Arka plan opaklık rengi
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
    okButton2: {
        alignSelf: 'flex-end',
        backgroundColor: '#019159',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5, // Android için gölge
    },
    animation2: {
        width: 120,
        height: 120,
        marginBottom: 16,
      },
      okButtonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
      },
  });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: 10,
        
    },
    settingsButton: {
        padding: 5,
        borderRadius: 5,
        position: 'absolute',
        top: 5,
        left: 0,
        zIndex: 1,
    },
    backButtonRight: {
        padding: 5,
        borderRadius: 5,
        position: 'absolute',
        top: 5,
        right: 0,
        zIndex: 1,
    },
    backButtonIcon: {
        width: 30,
        height: 30,
    },
    settingsButtonIcon: {
        width: 40,
        height: 40,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        position: 'relative',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    addPhotoText: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#101218',
        borderRadius: 12,
        padding: 5,
        textAlign: 'center',
    },
    profileName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    section: {
        marginBottom: 20,
        marginLeft: 0,
    },
    sectionTitle: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('0.8%'),
        color: 'white',
    },
    noMoviesText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'left',
        marginTop: 5,
        marginBottom:10,
    },
    movieContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#101218',
        borderRadius: 10,
        padding: 2,
        marginRight: 0,
    },
    moviePoster: {
        width: 150,
        height: 225,
        marginBottom: 5,
        borderRadius: 10,
    },
    movieTitle: {
        marginTop: 5,
        marginBottom:10,
        
        color: 'white',
        textAlign: 'center',
    },
    removeFavorite: {
        color: 'red',
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101218',
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 5, // Yeni eklenen stil, logout butonunun üst boşluğu
        alignSelf: 'center', // Butonun ortalanması için
        marginBottom:20,
    },
    logoutButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dialogTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    dialogMessage: {
        color: 'white',
    },
    cancelButton: {
        backgroundColor: '#4e4e4e',
        height:41,
    },
    confirmButton: {
        backgroundColor: 'white',
        marginLeft:10,
        height:41,
    },
    cancelButtonText: {
        color: 'white',
    },
    confirmButtonText: {
        color: 'black',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101218',
    },
    bannerAdContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '98%', // Full width
        marginBottom: 5, // Some space below the banner
            },
});

export default ProfileScreen;