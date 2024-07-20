import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BACKEND_URL } from '../../env';

const VerificationScreen = ({ props }) => {
  const [verificationCode, setVerificationCode] = useState(null)
  const emailVerificationEndpoint = `${BACKEND_URL}/accounts/verify-email/`

  const email = props.email
  // Function to handle verification
  const handleVerification = async () => {
    try {
      const response = await fetch(emailVerificationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        })

      const data = await response.json();
        if (response.status === 200) {
          navigation.navigate('VerificationScreen', {email});
        } else {
          alert('Failed to send verification code. Please try again.');
        }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
    console.log('Verifying code');
  };

  return (
    <ImageBackground source={require('../../assets/byte.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.verificationText}>Verification</Text>

          <TextInput 
          onChangeText={setVerificationCode}
          placeholder="Enter Verification Code" 
          style={styles.input}
           />

          <TouchableOpacity style={styles.button} onPress={handleVerification}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <Text style={styles.resendText}>Resend Code</Text>
        </View>
      </ScrollView>
     </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  verificationText: {
    fontSize: 25,
    fontWeight:'bold',
    color: '#004d40',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255)',
  },
  formContainer: {
    width: 330,
    height:300,
    marginBottom: 120,
    padding: 30,
    borderRadius: 35,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    width: 'auto',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  button: {
    width: 'auto',
    height: 50,
    backgroundColor: '#004d40',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  resendText: {
    fontSize: 16,
    color: '#004d40',
    marginBottom: 110,
    textAlign: 'right',
  },
 
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    marginHorizontal: 18,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
});

export default VerificationScreen;