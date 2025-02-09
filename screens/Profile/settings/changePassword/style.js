import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MD2DarkTheme } from 'react-native-paper';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: 15,
        
    },
    seccontainer: {
        flex: 1,
        justifyContent: 'flex-start', // İçeriği üst tarafa hizalar
        alignItems: 'center',
        backgroundColor: '#101218',
        padding: wp('5%'),
        paddingTop: hp('7%'), // Yukarı boşluk ekler
    },
    
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        
        textAlign: 'center',
        top:hp(3),
        
    },
    backButton: {
        padding: 10,
        position: 'absolute',
        top: 20,
        left: 10,
        zIndex: 1,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: '#1f319d',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('15%'),
        borderRadius: wp('5%'),
        marginTop: hp('6%'),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: hp('0.3%'),
        },
        shadowOpacity: 0.25,
        shadowRadius: hp('0.5%'),
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dialogTitle: {
        color: '#f3ce13',
        fontWeight: 'bold',
    },
    dialogMessage: {
        color: 'white',
    },
    confirmButton: {
        backgroundColor: '#f3ce13',
        marginLeft: 10,
    },
    confirmButtonText: {
        color: 'black',
    },
    inputContainer: {
        width: '100%',
        marginBottom: hp('2%'),
      },
      inputLabel: {
        color: '#b0aeae',
        fontSize: wp('3.5%'),
        
      },
      textInput: {
        backgroundColor: '#101218',
        color: 'white',
        fontSize: wp('3.5%'),
        width: '100%',
        height: hp('5%'), 
      },
      separator: {
        height: 1,
        backgroundColor: '#b0aeae',
        
        },
        space: {
            marginBottom:20,   
        },
        space2: {
            marginBottom:25,   
        },
        errorText: {
            color: '#E57373',
            fontSize: 13,
            marginTop:6,
        },
     
        noemailError: {
            color: 'red',
            fontSize: 13,
            marginTop:6,
            visibility: 'hidden',
        },        
});

export default styles;