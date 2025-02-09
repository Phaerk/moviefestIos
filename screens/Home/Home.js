import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


import auth from '@react-native-firebase/auth';




const API_KEY = 'f6de70a4a82aec4b70272b422861c7f1';
const API_URL = 'https://api.themoviedb.org/3';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';







const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [genres, setGenres] = useState([]);
    const [showBackButton, setShowBackButton] = useState(false);
    const [showCategories, setShowCategories] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedGenreName, setSelectedGenreName] = useState('');
    const [pressedButton, setPressedButton] = useState(null);
    const [loading, setLoading] = useState(false); // Yükleme durumu için yeni state
    const [bannerKey, setBannerKey] = useState(0);
    const navigation = useNavigation();

   
    
    const user = auth().currentUser;
    
    

    


    useFocusEffect(
        React.useCallback(() => {
            handleBack();
            setPressedButton(null);
            setShowOptions(false);
            setSelectedGenre(null); // Reset selected genre on focus
            setSelectedGenreName(''); 
            fetchPopularMovies();
            fetchTopRatedMovies();
            fetchUpcomingMovies();
            fetchGenres();
            
    
             // Force re-fetch when the screen is focused
            
        }, [])
    );


    useEffect(() => {
        handleBack();
        setPressedButton(null);
        setShowOptions(false);
        setSelectedGenre(null); // Reset selected genre on focus
        setSelectedGenreName(''); 
        fetchPopularMovies();
        fetchTopRatedMovies();
        fetchUpcomingMovies();
        fetchGenres();

        
    }, []);

   
    

    const fetchPopularMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/movie/popular`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });
            setPopularMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching popular movies:', error);
        }
    };

    const fetchTopRatedMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/movie/top_rated`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });
            setTopRatedMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching top rated movies:', error);
        }
    };

    const fetchUpcomingMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/movie/upcoming`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });
            setUpcomingMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching upcoming movies:', error);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get(`${API_URL}/genre/movie/list`, {
                params: {
                    api_key: API_KEY,
                    
                },
            });
            setGenres(response.data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const searchMovies = async () => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setShowBackButton(false);
            setShowCategories(true);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: searchQuery,
                    
                },
            });
            setSearchResults(response.data.results);
            setShowBackButton(true);
            setShowCategories(false);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    const fetchMoviesByGenre = async (genreId, genreName) => {
        setLoading(true); // Yükleme durumunu başlat
        try {
            const response = await axios.get(`${API_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_genres: genreId,
                    
                },
            });
            setSearchResults(response.data.results);
            setSelectedGenreName(genreName);
            setShowBackButton(true);
            setShowCategories(false);
            setShowOptions(false); // Kategoriler seçildikten sonra seçenekleri kapat
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
        } finally {
            setLoading(false); // Yükleme durumunu bitir
        }
    };

    const handleBack = () => {
        setShowOptions(false);
        setPressedButton(null);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedGenre(null);
        setSelectedGenreName('');
        setShowBackButton(false);
        setShowCategories(true);
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleButtonPress = (buttonId, genreName = '') => {
        setPressedButton(buttonId);
        fetchMoviesByGenre(buttonId, genreName);
    };

    const renderMovieItem = ({ item, index }) => {
        const posterStyle = selectedGenreName ? styles.poster2 : styles.poster;

        if (index % 2 === 0) {
            return (
                <View style={styles.movieRow}>
                    <MovieItem item={item} posterStyle={posterStyle} />
                    {searchResults[index + 1] && <MovieItem item={searchResults[index + 1]} posterStyle={posterStyle} />}
                </View>
            );
        }
        return null;
    };

  
    const MovieItem = ({ item }) => {
        const title = item.title.length > 18 ? item.title.substring(0, 18) + "..." : item.title;
        const posterStyle = selectedGenreName ? styles.poster2 : styles.poster;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
                <View style={styles.movieContainer}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} style={posterStyle} />
                    <Text style={styles.movieTitle}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    };


   
    
    
    return (
        
        <View style={styles.container}>
            
                <View style={styles.searchContainer}>
                    {showBackButton && (
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Icon name="arrow-back-ios-new" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                    <View style={styles.searchInput}>
                    
                    <Icon name="search" size={15} color="#A4A8B0" style={styles.searchIcon}/>
                    <TextInput
                        style={styles.searchInput2}
                        
                        placeholder={"Search"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={searchMovies}
                        placeholderTextColor="#A4A8B0"
                    />
                    </View>
                    <TouchableOpacity onPress={toggleOptions} style={styles.optionButton}>
                        <View style={styles.optionLine} />
                        <View style={styles.optionLine} />
                        <View style={styles.optionLine} />
                    </TouchableOpacity>
                   
                
            </View>
            <View >
                {showCategories && (
                    <ScrollView>
                        <View>
                            <Text style={styles.categoryTitle}>{"Popular Movies"}</Text>
                            <FlatList
                                data={popularMovies}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderMovieItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
    
                            <Text style={styles.categoryTitle}>{"Top Rated Movies"}</Text>
                            <FlatList
                                data={topRatedMovies}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderMovieItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
         
                            <Text style={styles.categoryTitle}>{"Upcoming Movies"}</Text>
                            <FlatList
                                data={upcomingMovies}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderMovieItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
  
                        </View>
                    </ScrollView>
                )}
                {selectedGenreName && (
                    <Text style={styles.genreHeader}>{selectedGenreName}</Text>
                )}
                {loading ? ( // Yükleme durumu
                    <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" style={styles.loader} />
                    <Text style={styles.loadingText}>{"Loading..."}</Text>
                </View>
                ) : (
                    searchResults.length > 0 && (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderMovieItem}
                            style={styles.flatList}
                            contentContainerStyle={styles.searchResultsContainer}
                        />
                    )
                )}
            </View>
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <ScrollView>
                        {genres.map((genre) => (
                            <TouchableOpacity
                                key={genre.id}
                                onPress={() => handleButtonPress(genre.id, genre.name)}
                                style={[
                                    styles.genreButton,
                                    pressedButton === genre.id && styles.pressedButton,
                                ]}
                            >
                                <Text style={styles.genreButtonText}>{genre.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
            
            
        </View>
        
    );
};

const styles = StyleSheet.create({
    searchIcon: {
      
    
    fontSize: 18, // Boyutu belirliyoruz
    color: "#A4A8B0", // Rengi belirliyoruz
    },
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: wp('2.5%'),
        paddingBottom: wp('10'),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
    },
    searchInput: {
        flexDirection: 'row', // Yatayda hizalama yapıyoruz
        alignItems: 'center', // Dikeyde ortalama
        flex: 1,
        height: hp('4%'),
        borderWidth: 1,
        color: 'white',
        borderRadius: wp('3.5%'),
        paddingHorizontal: wp('2.5%'),
        backgroundColor: '#3F4454',
        marginRight: wp('2.5%'),
    marginRight: wp('2.5%'),
        
    },
    searchInput2: {
        flex: 1,
        height: hp('4%'),
        fontSize: 16,
        color: 'white',
        paddingLeft: 5 ,
        paddingBottom: 0,
        marginRight: wp('2.5%'),
    },
    categoryTitle: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('0.8%'),
        color: 'white',
    },
    movieContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: hp('0.8%'),
       
        borderRadius: wp('2.5%'),
        padding: wp('0.5%'),
        marginRight: wp('0%'),
    },
    poster: {
        width: wp('40%'),
        height: hp('28%'),
        marginBottom: hp('0.8%'),
        borderRadius: 10,
    },
    poster2: {
        width: wp('46%'),
        height: hp('32.5%'),
        marginBottom: hp('0.8%'),
        borderRadius: 10,
    },

    backButton: {
        padding: wp('1.2%'),
        borderRadius: wp('1.2%'),
    },
   
    flatList: {
        flexGrow: 0,
    },
    optionButton: {
        width: wp('8%'),
        height: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLine: {
        width: wp('6.5%'),
        height: hp('0.25%'),
        backgroundColor: 'white',
        marginVertical: hp('0.4 s%'),
        borderRadius: wp('1%'),
    },
    optionsContainer: {
        position: 'absolute',
        top: hp('5%'),
        right: wp('2.6%'),
        backgroundColor: '#101218',
        borderRadius: wp('1.5%'),
        padding: wp('2.5%'),
        maxHeight: hp('73%'),
    },
    genreButton: {
        marginTop: hp('1.2%'),
        padding: wp('2.5%'),
        backgroundColor: '#3F4454',
        borderRadius: wp('1.5%'),
    },
    genreButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    pressedButton: {
        backgroundColor: 'grey',
    },
    searchResultsContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    movieRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1.2%'),
    },
    movieTitle: {
        color: 'white',
        marginTop: hp('0.8%'),
        textAlign: 'center',
    },
    genreHeader: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('0.8%'),
        color: 'white',
    },
    loader: {
        marginTop: hp('2.5%'),
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101218',
    },
    loadingText: {
        marginTop: hp('1.2%'),
        fontSize: wp('4%'),
        color: 'white',
    },
});

export default Home;
