// SignupScreen.js
import React, { useState } from 'react';
import { View, 
        TextInput, 
        TouchableOpacity, 
        Text, 
        StyleSheet, 
        Modal,
        ImageBackground, 
        ScrollView, 
        ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BACKEND_URL } from '../../env';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';


const registrationEndpoint=`${BACKEND_URL}/accounts/signup/`
const emailVerificationEndpoint=`${BACKEND_URL}/accounts/verify-email/`

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validationStage, setValidationStage] = useState(true);
  const [start, setStart] = useState(false)
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [submissionEndpoint, setSubmissionEndpoint ] = useState(registrationEndpoint)
  // const navigation = useNavigation()

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!code) newErrors.code = 'Code is required';
    if (!password) newErrors.password = 'Password is required';
    // if (!password.length>6) console.log(password.length)
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailVerification = async () => {
    console.log("email verification")
    if (!validate()) return
    let data = { email: email, code:code}
    setLoading(true)
    try {
      await axios.post(submissionEndpoint, data)
      .then(res => {
        if (res.status==200){
          alert(String(res.data.detail))
          setSubmissionEndpoint(emailVerificationEndpoint)
          setEmailCodeSent(true)
          setLoading(false)
          let msg = res.data['detail']
          navigation.navigate("LoginScreen")
        }
        else {
          setLoading(false)
          alert(String(res.data.detail))
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        alert('Verification failed')
        // setverificationCodeSent(false)
        // setregistrationMessage("Email Verification Failed")
      }
      )
    } catch (error) {
      console.log(error)
      alert('An error occurred. Please try again.');
    }
  };

  const handleSignup = async () => {
    console.log("sigup")
    // if (password.length >= 6){

    // }
    // if (!validate()) return
    let data = { email: email, password:password}
    console.log(registrationEndpoint)
    setLoading(true)
    // if (validationStage || !validate()) return;
    try {
      await axios.post(registrationEndpoint, data)
      .then(res => {
        if (res.status==200){
          alert(String(res.data.detail))
          setSubmissionEndpoint(emailVerificationEndpoint)
          setEmailCodeSent(true)
          setLoading(false)
          console.log(res)
          let msg = res.data['detail']
          navigation.navigate("LoginScreen")
        }else {
          alert("Sign up failed")
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        alert('Sign up failed')
        // setverificationCodeSent(false)
        // setregistrationMessage("Email Verification Failed")
      }
      )
    } catch (error) {
      console.log(error)
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <ImageBackground source={require('../../assets/byte.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.switchContainer}>
              <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.switchText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.switchButtonActive}>
                <Text style={styles.switchTextActive}>Register</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Email or Username"
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
            />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={setPassword}
              />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              {/* {start &&
                (<> */}
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                 {/* {start &&
                {/* </>
                ) */}
              {/* } */}
              {/* {emailCodeSent && (
                <>
                {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                <TextInput
                placeholder="Input the OTP sent your email"
                secureTextEntry={true}
                style={[styles.input, errors.code && styles.inputError]}
                value={code}
                onChangeText={setCode}
                />
                </>
                )
              } */}
            
            {/* {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            {emailCodeSent?
            (<TouchableOpacity style={styles.button} onPress={handleEmailVerification}>
              <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>):
             (<TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>)
            } */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, )',
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
    marginBottom: 40, blurView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,  text: {
        fontSize: 24,
        fontWeight: '600',
      },
      // backgroundColor: "red",
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  switchButtonActive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#004d40',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
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
    marginBottom:10,
    paddingTop:2,
    paddingLeft: 12,
    paddingBottom:12,
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

export default SignupScreen;
