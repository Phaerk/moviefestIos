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
      marginTop: hp('4%'),
      marginBottom: hp('2.5%'),
      fontSize: wp('4%'),
      color: 'grey',
      textDecorationLine: 'underline',
    },
    googleButton: {
      backgroundColor: '#101218',
      paddingVertical: hp('1.5%'),
      paddingHorizontal: wp('5%'),
      borderRadius: wp('5%'),
      borderColor: 'grey',
      borderWidth:1,
      marginTop: hp('2.5%'),
    
      flexDirection: 'row', // Ensure the text and icon are aligned horizontally
      alignItems: 'center', // Vertically align the icon and text
    },
    
    dialogContainer: {
      borderRadius: wp('8%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: hp('0.5%') },
      shadowOpacity: 0.3,
      shadowRadius: hp('1%'),
      elevation: 5,
      position: 'relative', // Konumu için relative ekledik
    },
  
  
  
    // Title with an icon and spacing
    dialogTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: wp('5%'),
      fontWeight: 'bold',
      color: 'white',
      marginBottom: hp('1%'),
      
    },
  
    // Icon for the alert title
    dialogActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',  // Sağ tarafta hizalamak için
      marginTop: -hp('2%'), // Eğer gerektiğinde biraz üst alabilirsiniz
      paddingHorizontal: wp('3%'),
    },
  
    closeIcon: {
      position: 'absolute', // Iconu absolute konumlandırıyoruz
      top: -90, // Üst kısma alıyoruz
      right: 5, // Sağ tarafa hizalıyoruz
    },
  
    // Dialog message styling
    dialogMessage: {
      color: 'white',
      fontSize: wp('4%'),
      
    },
  
    // Confirm button styling with more padding
    confirmButton: {
      backgroundColor: theme.colors.accent,
      paddingVertical: hp('0.5%'),
      paddingHorizontal: wp('6%'),
      borderRadius: wp('4%'),
     
    },
  
    // Confirm button text styling
    confirmButtonText: {
      color: 'white',
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
    separator: {
      height: 1,
      backgroundColor: '#b0aeae',
      
  },
  googleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',  // Butonların ekran genişliğinde ortalanmasını sağlar
  
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  
  separatorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Android gölge efekti
  },
  
  separatorText: {
    marginHorizontal: 10,
    color: '#b0aeae',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  });

  
export default styles;