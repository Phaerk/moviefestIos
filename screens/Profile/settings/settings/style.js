import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MD2DarkTheme } from 'react-native-paper';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101218',
        padding: 15,
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        bottom:hp(1.5),
        
    },
    section: {
        marginBottom: wp(5),
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'grey',
        marginBottom: 5,
        marginStart:10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#101218',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    optionl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#101218',
        padding: 0,
        paddingLeft:15,
        borderRadius: 5,
        marginBottom: 15,
    },
    optionIcon: {
        width: wp(7.656),
        height: wp(7.656),
        marginRight: 10,
    },
    optionArrowIcon: {
        width: wp(5),
        height: wp(5),
    },
    optionText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'left',
        flex: 1,
        paddingLeft:'10',
    },
    separator: {
        height: 1,
        backgroundColor: '#3F4454',
        marginVertical: 0,
        marginHorizontal:0,
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
    cancelButton: {
        backgroundColor: '#4e4e4e',
        height: 41,
    },
    confirmButton: {
        backgroundColor: 'white',
        marginLeft: 10,
        height: 41,
    },
    cancelButtonText: {
        color: 'white',
    },
    confirmButtonText: {
        color: 'black',
    },
    bannerAdContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '98%',
        marginBottom: 5,
    },
    
   
});

export default styles;