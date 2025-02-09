import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { Modal, Paragraph, Button, Portal, PaperProvider, MD2DarkTheme } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import styles from './style';
import LottieView from 'lottie-react-native';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [passwordError, setPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [newConPasswordError, setNewconPasswordError] = useState('');
      

    const showCustomDialog = (title, message, onConfirmAction = () => {}) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setOnConfirm(() => onConfirmAction);
        setDialogVisible(true);
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setNewPasswordError('');
        setNewconPasswordError('');

        if (!currentPassword || !newPassword || !confirmPassword ) {
            if (!currentPassword) setPasswordError('Current password is required');
            if (!newPassword) setNewPasswordError('New password is required');
            if (!confirmPassword) setNewconPasswordError('Confirm password is required');    
            return;
        }

        if (newPassword !== confirmPassword) {
            setNewconPasswordError('New password and confirm password do not match'); 
            return;
        }
        if (newPassword === currentPassword) {
          setNewconPasswordError('New password and current password can not be same'); 
          return;
      }

    
        const user = auth().currentUser;
    
        if (user) {
            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
    
            try {
                await user.reauthenticateWithCredential(credential);
                await user.updatePassword(newPassword);
                setModalVisible(true);
            } catch (error) {
                if (error.code === 'auth/invalid-credential') {
                    setPasswordError('Invalid password');
                  }
                  else if (error.code === 'auth/weak-password') {
                    setNewPasswordError('New password must be at least 6 characters long');
                  } 
                  else{
                    setPasswordError(error.message)    }
            }
        } 
    };

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
                
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcon name="arrow-back-ios" size={27} color="white" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Change Password</Text>
                <View style={styles.space2}></View>
                <View style={styles.seccontainer}>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter Current Password"
                    placeholderTextColor="#b0aeaeg"
                    secureTextEntry
                    value={currentPassword}
                    onFocus={() => setPasswordError('')}
                    onChangeText={text => {
                        setCurrentPassword(text);
                        if (text) setPasswordError('');
                    }}
               
                />
                 <View style={styles.separator} />
                 {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : <Text style={styles.noemailError}>{passwordError}</Text>}
                </View>
                <View style={styles.space}></View>
<View style={styles.inputContainer}>
<Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter New Password"
                    placeholderTextColor="#b0aeae"
                    secureTextEntry
                    value={newPassword}
                    onFocus={() => setNewPasswordError('')}
                    onChangeText={text => {
                        setNewPassword(text);
                        if (text) setNewPasswordError('');
                    }}
                   
                />
                 <View style={styles.separator} />
                 {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : <Text style={styles.noemailError}>{newPasswordError}</Text>}
</View>
<View style={styles.space}></View>
<View style={styles.inputContainer}>
<Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#b0aeae"
                    secureTextEntry
                    value={confirmPassword}
                    onFocus={() => setNewconPasswordError('')}
                    onChangeText={text => {
                        setConfirmPassword(text);
                        if (text) setNewconPasswordError('');
                    }}
                
                />
                 <View style={styles.separator} />
                 {newConPasswordError ? <Text style={styles.errorText}>{newConPasswordError}</Text> : <Text style={styles.noemailError}>{newConPasswordError}</Text>}
                </View>
                <TouchableOpacity onPress={handleChangePassword}>
                    <View style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Change Password</Text>
                    </View>
                    
                </TouchableOpacity>
                </View>
                <Portal>
  <Modal
    visible={modalVisible}
    onDismiss={() => setModalVisible(false)}
    contentContainerStyle={modalStyles.modalContainer}
  >
    <View style={modalStyles.modalContent}>
      <LottieView
        source={require('../../../../assets/animations/lock.json')}
        autoPlay
        loop={false}
        style={modalStyles.animation}
      />

      <Text style={modalStyles.modalTitle}>Password Changed</Text>
      <Text style={modalStyles.modalMessage}>
        Your password has been successfully updated.
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
            </SafeAreaView>
        </PaperProvider>
    );
};

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
      backgroundColor: '#019159',
      borderRadius: 8,
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
  });
  

export default ChangePassword;