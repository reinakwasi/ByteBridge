import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BACKEND_URL } from '../../env';
import { ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordScreen from './ForgotPasswordScreen';
const storage = AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("")
  const [optSent, setOptSent] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState("")

  // const navigation = useNavigation()

  const validate = () => {
    const newErrors = {};
    if (!emailOrUsername) newErrors.emailOrUsername = 'Email or Username is required';
    // if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setLoading(true)
    var data = {
      email: emailOrUsername,
      password: password
    }
    await axios.post(`${BACKEND_URL}/accounts/login/`, data)
      .then((res) => {
        setLoading(false)
        console.log(res.data)
        access_token = res.data['access']
        storage.setItem('token', access_token)
        console.log(res.data)
        navigation.navigate('CloudScreen')
      })
      .catch((err) => {
        setLoading(false) 
        setLoginError(true)
        setLoginErrorMessage("User authentication failed")
        console.log(err)
      })
    }

    const handleOtp = async () => {
      console.log("Requesting otp")
      if (!validate()) return;
      var data = {
        email: emailOrUsername,
      }

      console.log(data)
      setLoading(true)
      await axios.post(`${BACKEND_URL}/accounts/otp/`, data)
        .then((res) => {
          console.log(res)

          setLoading(false)
          setOptSent(true)
          setLoginSuccess(true)
          setLoginSuccessMessage(res.data.detail)
        }
        )
        .catch((err) => {
          setLoading(false)
          setLoginError(true)
          setLoginErrorMessage("User does not exists")
          console.log(err)
        })



    };

    // Implement login logic here
    // console.log('Logging in with:', emailOrUsername, password);

  return (
    <ImageBackground source={require('../../assets/byte.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.switchContainer}>
              <TouchableOpacity style={styles.switchButtonActive}>
                <Text style={styles.switchTextActive}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.switchText}>Sign up</Text>
              </TouchableOpacity>
            </View>
            {loginSuccess && <Text style={styles.successText}>{loginSuccessMessage}</Text>}
            {loginError && <Text style={styles.errorText}>{loginErrorMessage}</Text>}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your email"
                style={[styles.input, errors.emailOrUsername && styles.inputError]}
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
              />
              {errors.emailOrUsername && <Text style={styles.errorText}>{errors.emailOrUsername}</Text>}
            </View>
            {optSent ?
              (<>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter OTP"
                    secureTextEntry={true}
                    style={[styles.input, errors.password && styles.inputError]}
                    value={password}
                    onChangeText={setPassword}
                  />
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </>) : (
                <TouchableOpacity style={styles.button} onPress={handleOtp}>
                  <Text style={styles.buttonText}>Request OTP</Text>
                </TouchableOpacity>
              )}
        
          </View>
        </View>
      </ScrollView>

      <Modal visible={loading} transparent animationType="fade">
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            {/* <GeneralLoader /> */}
            {/* <ReceiveLoader /> */}
            <ActivityIndicator size={60} color="#004d40" />
            {/* <Text style={styles.text}>loading...</Text> */}
          </View>
        </BlurView>
      </Modal>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  formContainer: {
    width: 330,
    marginTop: 70,
    padding: 30,
    borderRadius: 35,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 1,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  switchButtonActive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#004d40',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  switchText: {
    color: '#004d40',
    fontSize: 18,
  },
  switchTextActive: {
    color: '#fff',
    fontSize: 18,
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -25,
    marginBottom: 10,
    paddingTop: 2,
    paddingLeft: 12,
    paddingBottom: 12,
  },

  successText: {
    color: 'green',
    marginTop: -25,
    marginBottom: 10,
    paddingTop: 5,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#004d40',
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

  LoginText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
    paddingBottom: 10,
  },

  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },

  text: {
    marginTop: 130,
    fontSize: 24,
    color: "#004d40",
    fontWeight: '600',
  },

  modalContainer: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
