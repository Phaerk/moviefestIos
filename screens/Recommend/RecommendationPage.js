import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,ActivityIndicator,SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
 
import auth from '@react-native-firebase/auth';


const API_KEY = 'f6de70a4a82aec4b70272b422861c7f1';
const API_URL = 'https://api.themoviedb.org/3';



const RecommendationPage = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedStartYear, setSelectedStartYear] = useState(null);
    const [selectedEndYear, setSelectedEndYear] = useState(null);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const navigation = useNavigation();
    
    const user = auth().currentUser;


    

   

   


    useFocusEffect(
        React.useCallback(() => {
            
            
            fetchGenres();
    
             // Force re-fetch when the screen is focused
            
        }, [])
    );


    useEffect(() => {
        
        fetchGenres();

        
    }, []);

    

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

    const toggleGenre = (genre) => {
        if (selectedGenres.includes(genre.id)) {
            setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre.id));
        } else {
            setSelectedGenres([...selectedGenres, genre.id]);
        }
    };

    const recommendMovies = async () => {
        if (!selectedStartYear || !selectedEndYear) {
            alert('Please select both start and end years.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    
                    with_genres: selectedGenres.join(','),
                    'primary_release_date.gte': `${selectedStartYear}-01-01`,
                    'primary_release_date.lte': `${selectedEndYear}-12-31`,
                    sort_by: 'popularity.desc',
                },
            });

            const filteredMovies = response.data.results.filter(movie => movie.vote_average < 10);
            setRecommendedMovies(filteredMovies);

            if (filteredMovies.length > 0) {
                navigation.navigate('MovieDetailsRecommend', { movieId: filteredMovies[0].id, movies: filteredMovies });
            } else {
                alert('No movies found for the selected criteria');
            }
        } catch (error) {
            console.error('Error fetching recommended movies:', error);
        }
    };

   
     return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navigationBar}>
                
                <Text style={styles.navigationText}>{"Recommend Me A Film"}</Text>
            </View>
            
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{"Select Genres"}</Text>
                    <View style={styles.genreContainer}>
                        {genres.map((genre, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.genreButton,
                                    selectedGenres.includes(genre.id) && styles.genreButtonSelected,
                                ]}
                                onStartShouldSetResponder={() => toggleGenre(genre)}
                            >
                                <Text style={styles.genreButtonText}>{genre.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{"Select Year Range"}</Text>
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={selectedStartYear}
                                onValueChange={(itemValue) => setSelectedStartYear(itemValue)}
                                style={styles.yearPicker}
                            >
                                <Picker.Item label={"Select Start Year"} value={null} color='white' />
                                {Array.from({ length: 2024 - 1970 + 1 }, (_, i) => 1970 + i).map((year) => (
                                    <Picker.Item key={year} label={`${year}`} value={year} color='white' />
                                ))}
                            </Picker>
                        </View>
                        <View style={[styles.pickerWrapper, styles.rightPickerWrapper]}>
                            <Picker
                                selectedValue={selectedEndYear}
                                onValueChange={(itemValue) => setSelectedEndYear(itemValue)}
                                style={styles.yearPicker}
                            >
                                <Picker.Item label={"Select End Year"} value={null} color='white'/>
                                {Array.from({ length: 2024 - 1970 + 1 }, (_, i) => 2024 - i).map((year) => (
                                    <Picker.Item key={year} label={`${year}`} value={year} color='white' />
                                ))}
                            </Picker>
                        </View>
                    </View>
                   
                </View>
                <TouchableOpacity style={styles.recommendButton} onPress={recommendMovies}>
                    <Text style={styles.recommendButtonText}>{"Recommend"}</Text>
                </TouchableOpacity>
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: 10,
        paddingStart:10,
        paddingEnd:10
    },
     header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    scrollView: {
        marginBottom: 5, // Adjusted to accommodate recommendButton
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genreButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#3F4454',
        borderRadius: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genreButtonSelected: {
        backgroundColor: 'grey',
    },
    genreButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    recommendButton: {
        backgroundColor: '#3F4454',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0, // Adjusted from 120 to 20
    },
    recommendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    pickerWrapper: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 10, // Add right margin for spacing between pickers
    },
    rightPickerWrapper: {
        marginRight: 0, // Remove right margin for the last picker
    },
    yearPicker: {
        backgroundColor: '#101218',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    pickerItemStyle: {
        height: 30, // Adjust the height of each item in the dropdown list
    },    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        color:'black',
    },
    backButton: {
        left:10,
        position: 'absolute',
         
    },
    backButtonIcon: {
        width: 25,
        height: 25,
    },
    navigationText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101218',
        height: 50,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom:5,
        
    },
    bannerAdContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '98%', // Full width
         
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161618',
    },       
});

export default RecommendationPage;