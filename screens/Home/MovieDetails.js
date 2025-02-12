import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator,SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Portal ,Modal,PaperProvider,MD2DarkTheme} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { Auth } from '../AuthScreens/services';

const API_KEY = 'f6de70a4a82aec4b70272b422861c7f1';
const API_URL = 'https://api.themoviedb.org/3';

const MovieDetailsScreen = ({ route }) => {
    const { movieId } = route.params;
    const navigation = useNavigation();
    const [movieDetails, setMovieDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [selectedActor, setSelectedActor] = useState(null);
    const [showFullBio, setShowFullBio] = useState(false);
    const scrollViewRef = useRef(null); 
    const [isAnon, setIsAnon] = useState(false);
    const [anonModalVisible, setAnonModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!movieDetails ) {
                setIsLoading(true);
            }else{setIsLoading(false);}
        }, 0); // Burada 2000 milisaniye = 2 saniye

        // Temizleme işlevi
        return () => clearTimeout(timer);
    }, [movieDetails]);

   





    

    useEffect(() => {
        
        fetchMovieDetails();
        fetchCast();
        if (user) {
            if (user.isAnonymous) {
                setIsAnon(true);
            }
            checkFavoriteStatus();
            checkWatchedStatus();
        }
    }, []);

    
    useFocusEffect(
        React.useCallback(() => {
            
            fetchMovieDetails();
        fetchCast();
        if (user) {
            checkFavoriteStatus();
            checkWatchedStatus();
        }
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }, [])
    );



  

    const handleLogout = () => {
        Auth.signOut();
    };

    const fetchMovieDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/movie/${movieId}`, {
                params: {
                    api_key: API_KEY,
                   
                    append_to_response: 'videos',
                },
            });
            setMovieDetails(response.data);
        } catch (error) {
            console.error('Film detaylarını çekerken hata oluştu:', error);
        }
    };

    const fetchCast = async () => {
        try {
            const response = await axios.get(`${API_URL}/movie/${movieId}/credits`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });
            setCast(response.data.cast);
        } catch (error) {
            console.error('Oyuncu bilgilerini çekerken hata oluştu:', error);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const doc = await firestore().collection('users').doc(user.uid).collection('favorites').doc(movieId.toString()).get();
            setIsFavorite(doc.exists);
        } catch (error) {
            console.error('Favori durumu kontrol edilirken hata oluştu:', error);
        }
    };

    const checkWatchedStatus = async () => {
        try {
            const doc = await firestore().collection('users').doc(user.uid).collection('watched').doc(movieId.toString()).get();
            setIsWatched(doc.exists);
        } catch (error) {
            console.error('İzledim durumu kontrol edilirken hata oluştu:', error);
        }
    };

    const toggleFavorite = async () => {
        if (isAnon) {
            setAnonModalVisible(true);
            return;
        }
        try {
            const userDoc = firestore().collection('users').doc(user.uid);
            const movieDoc = userDoc.collection('favorites').doc(movieId.toString());

            if (isFavorite) {
                await movieDoc.delete();
            } else {
                await movieDoc.set({ movieId });
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Favori durumu değiştirilirken hata oluştu:', error);
        }
    };

    const toggleWatched = async () => {
        if (isAnon) {
            setAnonModalVisible(true);
            return;
        }
        try {
            const userDoc = firestore().collection('users').doc(user.uid);
            const movieDoc = userDoc.collection('watched').doc(movieId.toString());

            if (isWatched) {
                await movieDoc.delete();
            } else {
                await movieDoc.set({ movieId });
            }

            setIsWatched(!isWatched);
        } catch (error) {
            console.error('İzledim durumu değiştirilirken hata oluştu:', error);
        }
    };

    const showActorDetails = async (actorId) => {
        try {
            const response = await axios.get(`${API_URL}/person/${actorId}`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });

            const movieCreditsResponse = await axios.get(`${API_URL}/person/${actorId}/movie_credits`, {
                params: {
                    api_key: API_KEY,
                   
                },
            });

            const shortenedMovieCredits = movieCreditsResponse.data.cast.map(item => ({
                ...item,
                title: item.title.length > 16 ? item.title.substring(0, 16) + "..." : item.title
            }));

            setSelectedActor({
                ...response.data,
                age: calculateAge(response.data.birthday),
                movieCredits: shortenedMovieCredits,
            });
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } catch (error) {
            console.error('Oyuncu detaylarını çekerken hata oluştu:', error);
        }
    };

    const closeActorDetails = () => {
        setSelectedActor(null);
        setShowFullBio(false);
    };

    const toggleBio = () => {
        setShowFullBio(!showFullBio);
    };

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="white" />
           </View>)
   }

    const releaseYear = movieDetails.release_date.substring(0, 4);
    if (!isLoading) {
    return (
        <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" ref={scrollViewRef} style={styles.container}>
        
            {selectedActor && (
                <View style={styles.actorDetailsContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeActorDetails}>
                        <Text style={styles.closeButtonText}>{'Close'}</Text>
                    </TouchableOpacity>
                    <View style={styles.actorInfo}>
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w200/${selectedActor.profile_path}` }}
                            style={styles.actorProfileImage}
                        />
                        <Text style={styles.actorNameDetail}>
                            {selectedActor.name} ({selectedActor.age})
                        </Text>
                        <Text
                            style={styles.actorBio}
                            numberOfLines={showFullBio ? 12 : 3}
                        >
                            {selectedActor.biography}
                        </Text>
                        {selectedActor.biography && selectedActor.biography.length > 100 && (
                            <TouchableOpacity onPress={toggleBio}>
                                 <Text style={styles.readMoreText}>{showFullBio ? 'Read Less' : 'Read More'}</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.actorDetails}>
                            <Text> 
                            <Text style={styles.actorDetailText}>{'Born: '}</Text>
                            <Text style={styles.birthdayText}>{selectedActor.birthday || '-'}</Text>
                            
                            </Text>

                            <Text> 
                            <Text style={styles.actorDetailText}>{'Place of Birth: '}</Text>
                            <Text style={styles.birthdayText}>{selectedActor.place_of_birth || '-'}</Text>
                            
                            </Text>

                            
                           
                            
                        </View>
                        <FlatList
                            horizontal
                            data={selectedActor.movieCredits}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                onPress={() => navigation.push('MovieDetails', { movieId: item.id })}
            style={styles.movieCreditItem}
                            >
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}` }}
                                        style={styles.moviePoster}
                                    />
                                    <Text style={styles.movieTitle}>{item.title}</Text>
                                    </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            )}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcon name="arrow-back-ios-new" size={27} color="white" />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}` }}
                            style={styles.poster}
                        />
                    
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{movieDetails.title} ({releaseYear})</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.playContainer}>
                            <TouchableOpacity style={styles.playButton}>
                                <Text style={styles.playText}>{'IMDB '}{movieDetails.vote_average.toFixed(1)}</Text>
                            </TouchableOpacity>
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
                                <MaterialCommunityIcons
  name={isFavorite ? "heart" : "heart-outline"}
  size={40}  // İstediğin boyutu ayarla
  color={isFavorite ? "red" : "white"}  // Favori ise kırmızı, değilse gri
  style={styles.icon}
/>
                                    <Text style={styles.favText}>{isFavorite ? 'Liked' : 'Like'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleWatched} style={styles.actionButton}>
                                <MaterialCommunityIcons
  name={isWatched ? "eye" : "eye-outline"}
  size={40}  // İstediğin boyutu ayarla
  color={isWatched ? "green" : "white"}  // İzlenenler için yeşil, izlenmeyenler için gri
  style={styles.icon}
/>
                                    <Text style={styles.favText}>{isWatched ? 'Watched' : 'Not Watched'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.overview}>{movieDetails.overview}</Text>
                </View>
            </View>
            <View style={styles.castContainer}>
                <Text style={styles.castTitle}>{'Cast'}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {cast.map(actor => (
                        <TouchableOpacity
                            key={actor.id}
                            style={styles.actorContainer}
                            onPress={() => showActorDetails(actor.id)}
                        >
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w200/${actor.profile_path}` }}
                                style={styles.actorImage}
                            />
                            <Text style={styles.actorName}>{actor.name}</Text>
                        </TouchableOpacity>
                    ))}
                    
                </ScrollView>
            </View>
            
        </ScrollView>
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
        </PaperProvider>
        
    );
    
};
}

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
        backgroundColor: '#019159',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5, // Android için gölge
    },
    animation: {
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
    picker: {
        width: wp(40),
        color: 'white',
        backgroundColor: '#101218',
    },
    container: {
        flex: 1,
        backgroundColor: '#101218',
    },
    backButton: {
        padding: wp(1.276),
        borderRadius: 5,
        position: 'absolute',
        top: hp(2.56),
        left: wp(2),
        zIndex: 1,
    },
    backButtonIcon: {
        width: wp(7.656),
        height: wp(7),
    },
    contentContainer: {
        paddingBottom: hp(2.56),
    },
    loadingText: {
        color: 'white',
        fontSize: wp(6.1),
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: hp(2.56),
        marginTop: hp(2.56),
    },
   
    poster: {
        width: wp(47,85),
        height: hp(36),
        borderRadius: 10,
    },
    playContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: hp(0.64),
        paddingBottom: hp(1.28),
    },
    playButton: {
        backgroundColor: '#f3ce13',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.3),
        borderRadius: 5,
    },
    playText: {
        fontSize: wp(4.066),
        color: 'black',
        fontWeight: 'bold',
    },
    detailsContainer: {
        paddingHorizontal: wp(2.552),
    },
    title: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: hp(1.28),
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: hp(1.28),
    },
    overview: {
        fontSize: wp(4.066),
        color: 'white',
        textAlign: 'justify',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#101218',
        paddingHorizontal: wp(3.828),
        paddingVertical: hp(1.024),
        borderRadius: 5,
        marginRight: wp(2.552),
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: wp(4),
    },
    castContainer: {
        marginTop: hp(2.56),
        paddingHorizontal: wp(2.552),
        marginBottom: hp(2),
    },
    castTitle: {
        fontSize: wp(5.083),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: hp(1.28),
    },
    actorContainer: {
        marginRight: wp(2.552),
        alignItems: 'center',
    },
    actorImage: {
        width: wp(30.624),
        height: hp(23.04),
        borderRadius: 10,
    },
    actorName: {
        marginTop: hp(0.64),
        fontSize: wp(4.066),
        color: 'white',
        textAlign: 'center',
    },
    actorNameDetail: {
        fontSize: wp(6.1),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: hp(1.28),
        alignSelf: 'center',
    },
    actorDetailsContainer: {
        paddingTop: hp(2),
        paddingHorizontal: 2,
        backgroundColor: '#101218',
        position: 'absolute',
        top: 0,
        left: 8,
        right: 8,
        bottom: 0,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: hp(2.56),
        right: wp(2),
        padding: wp(2),
    },
    closeButtonText: {
        color: 'white',
        fontSize: wp(4.066),
        fontWeight: 'bold',
    },
    actorInfo: {
        alignItems: 'left',
    },
    actorProfileImage: {
        width: wp(30),
        height: wp(45),
        borderRadius: 10,
        marginBottom: hp(3),
        alignSelf: 'center',
    },
    movieCreditsContainer: {
        maxHeight: hp(40),
        marginTop: hp(2),
    },
    movieCreditItem: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#101218',
        borderRadius: 10,
        padding: 2,
        marginRight: 0,
    },
    moviePoster: {
        width: 160,
        height: 225,
        marginBottom:5,
    },
    movieTitle: {
        marginTop: 5,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    movieCharacter: {
        fontSize: wp(3.555),
        color: 'white',
    },
    favText: {
        fontSize: wp(3.05),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: hp(1.28),
    },
    actorBio: {
        fontSize: wp(3.2),
        color: 'white',
        textAlign: 'justify',
        marginBottom: hp(1.28),
    },
    readMoreText: {
        fontSize: wp(3.555),
        color: 'grey',
        alignSelf: 'center',
    },
    actorDetails: {
        marginTop: hp(4),
        marginBottom: hp(4),
        alignItems: 'flex-start',
    },
    actorDetailText: {
        fontSize: wp(3.3),
        color: 'white',
        marginBottom: hp(0.64),
        textAlign: 'left',
        fontWeight: 'bold',
    },
    birthdayText: {
        fontSize: wp(3),
        color: 'white',
        marginBottom: hp(0.64),
        textAlign: 'left',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101218',
    },
});

export default MovieDetailsScreen;

