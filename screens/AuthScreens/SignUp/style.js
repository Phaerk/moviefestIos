import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MD2DarkTheme } from 'react-native-paper';
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

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#101218',
            padding: wp('5%'),
        },
        title: {
            fontSize: wp('6%'),
            fontWeight: 'bold',
            marginBottom: hp('2.5%'),
            color: 'white',
        },
        textInput: {
            backgroundColor: '#101218',
            color: 'white',
            fontSize: wp('3.5%'),
            width: '100%',
            height: hp('5%'), 
          },
          button: {
            backgroundColor: '#1f319d',
            paddingVertical: hp('1.5%'),
            paddingHorizontal: wp('25%'),
            borderRadius: wp('5%'),
            marginTop: hp('2.5%'),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: hp('0.3%'),
            },
            shadowOpacity: 0.25,
            shadowRadius: hp('0.5%'),
            elevation: 5,
          },
        buttonText: {
            color: '#FFFFFF',
            fontSize: wp('4.5%'),
            fontWeight: 'bold',
        },
        signupText: {
            marginTop: hp('2.5%'),
            fontSize: wp('4.2%'),
            color: 'grey',
            textDecorationLine: 'underline',
        },
        dialogTitle: {
            color: '#f3ce13',
            fontWeight: 'bold',
        },
        dialogMessage: {
            color: 'white',
        },
       confirmButton: {
           backgroundColor: theme.colors.accent,
           paddingVertical: hp('0.5%'),
           paddingHorizontal: wp('6%'),
           borderRadius: wp('4%'),
          
         },
        confirmButtonText: {
            color: 'white',
            fontSize: wp('4%'),
            fontWeight: 'bold',
          },
        inputContainer: {
            width: '100%',
            marginBottom: hp('2%'),
           
          },
          separator: {
            height: 1,
            backgroundColor: '#b0aeae',
           
        },
        inputLabel: {
            color: '#b0aeae',
            fontSize: wp('3.5%'),
            
          },
          errorText: {
            color: '#E57373',
            fontSize: 13,
            marginTop:6,
          },
          space: {
            marginBottom:20,   
            },
            noemailError: {
              color: '#101218',
              fontSize: 13,
              marginTop:6,
              visibility: 'hidden',
            },
    });

export default styles;  