import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // Import AntDesign from expo/vector-icons
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import PhotoScreen from './Screens/components/PhotoScreen';
import VideoScreen from './Screens/components/VideoScreen';
import AudioScreen from './Screens/components/AudioScreen';
import DocumentScreen from './Screens/components/Document';
import SendRequestScreen from './Screens/SendRequestScreen';
import ReceiveScreen from './Screens/ReceiveScreen';



const Tab = createBottomTabNavigator();

const Stack = createStackNavigator()
const MainTapNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopWidth: 0,
          height: 70,
          paddingTop: 12,
          paddingBottom: 12
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Photo':
              iconName = 'photo';
              break;
            case 'Video':
              iconName = 'videocam';
              break;
            case 'Audio':
              iconName = 'audiotrack';
              break;
            case 'Document':
              iconName = 'description';
              break;
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'rgb(53,189,153)',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Photo" component={PhotoScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Document" component={DocumentScreen} />
    </Tab.Navigator>
  )
}

const ShuffleButtonComponent = () => {
    const navigation = useNavigation()

    const [showPopUp, setShowPopUp] = useState(false);

    const handleShufflePress = () => {
      setShowPopUp(!showPopUp);
    };

    return (
      <View>
      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
          <AntDesign name="swap" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {showPopUp && (
        <View style={styles.popUpContainer}>
          <TouchableOpacity style={styles.popUpButton} onPress={() => navigation.navigate("SendRequestScreen")}>
            <AntDesign name="upload" size={24} color="black" />
            <Text style={styles.popUpText}>Send</Text>
          </TouchableOpacity>
          <View style={styles.spaceBetweenButtons} />
          <TouchableOpacity style={styles.popUpButton} onPress={() => navigation.navigate("ReceiveScreen")}>
            <AntDesign name="download" size={24} color="black" />
            <Text style={styles.popUpText}>Receive</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    )
}

const MainStackNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='MainTapNavigtor'
          component={MainTapNavigator}
        />
        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='SendRequestScreen'
          component={SendRequestScreen}
        />

        <Stack.Screen 
         options={{
          headerShown: false
        }}
        name='ReceiveScreen'
        component={ReceiveScreen}
        />
      </Stack.Navigator> 
      
      <ShuffleButtonComponent />
    </NavigationContainer>

  )
}

const App = () => {

  return (
    <View style={styles.container}>
      <MainStackNavigator />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  shuffleButton: {
    backgroundColor: 'rgb(53,189,153)',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
  },
  popUpButton: {
    backgroundColor: 'rgb(53,189,153)',
    padding: 8,// Navigate to SendRequestScreen
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popUpText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5, // Add some space between icon and text
  },
  spaceBetweenButtons: {
    width: 30,
    marginEnd: 10,
  },
});

export default App;


// import 'react-native-gesture-handler';
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { TransitionPresets } from '@react-navigation/stack';
// import { MaterialIcons, AntDesign } from '@expo/vector-icons';

// import LoginScreen from './Screens/components/LoginScreen';
// import ForgotPasswordScreen from './Screens/components/ForgotPasswordScreen';
// import SignupScreen from './Screens/components/SignUpScreen';
// import VerificationScreen from './Screens/components/verificationScreen';
// import PhotoScreen from './Screens/components/PhotoScreen';
// import VideoScreen from './Screens/components/VideoScreen';
// import AudioScreen from './Screens/components/AudioScreen';
// import DocumentScreen from './Screens/components/Document';

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// const BottomTabNavigator = () => {
//   const [showPopUp, setShowPopUp] = useState(false);

//   const handleShufflePress = () => {
//     setShowPopUp(!showPopUp);
//   };

//   return (
//     <View style={styles.container}>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => {
//             let iconName;

//             switch (route.name) {
//               case 'Photo':
//                 iconName = 'photo';
//                 break;
//               case 'Video':
//                 iconName = 'videocam';
//                 break;
//               case 'Audio':
//                 iconName = 'audiotrack';
//                 break;
//               case 'Document':
//                 iconName = 'description';
//                 break;
//             }

//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           },
//         })}
//         tabBarOptions={{
//           activeTintColor: 'tomato',
//           inactiveTintColor: 'gray',
//         }}
//       >
//         <Tab.Screen name="Photo" component={PhotoScreen} />
//         <Tab.Screen name="Video" component={VideoScreen} />
//         <Tab.Screen name="Audio" component={AudioScreen} />
//         <Tab.Screen name="Document" component={DocumentScreen} />
//       </Tab.Navigator>

//       <View style={styles.shuffleButtonContainer}>
//         <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
//           <AntDesign name="swap" size={32} color="white" />
//         </TouchableOpacity>
//       </View>

//       {showPopUp && (
//         <View style={styles.popUpContainer}>
//           <TouchableOpacity style={styles.popUpButton}>
//             <AntDesign name="upload" size={24} color="black" />
//             <Text style={styles.popUpText}>Send</Text>
//           </TouchableOpacity>
//           <View style={styles.spaceBetweenButtons} />
//           <TouchableOpacity style={styles.popUpButton}>
//             <AntDesign name="download" size={24} color="black" />
//             <Text style={styles.popUpText}>Receive</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{
//           headerShown: false,
//           ...TransitionPresets.FadeFromBottomAndroid,
//         }}
//       >
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//         <Stack.Screen name="Signup" component={SignupScreen} />
//         <Stack.Screen name="Verification" component={VerificationScreen} />
//         <Stack.Screen name="Main" component={BottomTabNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   shuffleButtonContainer: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//   },
//   shuffleButton: {
//     backgroundColor: 'rgb(53,189,153)',
//     padding: 15,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   popUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 20,
//     position: 'absolute',
//     bottom: 150,
//     alignSelf: 'center',
//   },
//   popUpButton: {
//     backgroundColor: 'rgb(53,189,153)',
//     padding: 8,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row', // Align icon and text horizontally
//   },
//   popUpText: {
//     color: 'black',
//     fontSize: 16,
//     marginLeft: 5, // Add some space between icon and text
//   },
//   spaceBetweenButtons: {
//     width: 20,
//   },
// });

// export default App;







