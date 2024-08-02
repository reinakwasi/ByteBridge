import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import HistoryScreen from './Screens/components/HistoryScreen';
import PhotoScreen from './Screens/components/PhotoScreen';
import VideoScreen from './Screens/components/VideoScreen';
import AudioScreen from './Screens/components/AudioScreen';
import DocumentScreen from './Screens/components/Document';
import SendRequestScreen from './Screens/SendRequestScreen';
import ReceiveScreen from './Screens/ReceiveScreen';
import NewCloudScreen from './Screens/components/NewCloudScreen';
import CloudScreen from './Screens/components/CloudScreen';
import LoginScreen from './Screens/components/LoginScreen';
import SignupScreen from './Screens/components/SignUpScreen';
import VerificationScreen from './Screens/components/VerificationScreen';
import ForgotPasswordScreen from './Screens/components/ForgotPasswordScreen';
import ViewCloudDataScreen from './Screens/components/ViewCloudDataScreen';
import SplashScreen from './Screens/components/SplashScreen';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator()
const MainTapNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopWidth: 0,
          height: 73,
          paddingTop: 12,
          backgroundColor: "rgb(247, 255, 255)",
          // borderTopEndRadius:150,
          elevation: 32,
          paddingBottom: 12,
        },
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          const size = 33
          switch (route.name) {
            case 'Cloud':
              iconName = 'cloud'
              break;
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
        activeTintColor: '#004d40',
        inactiveTintColor: 'grey',

      }}
    >

      <Tab.Screen name="Photo" component={PhotoScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Document" component={DocumentScreen} />
      <Tab.Screen name="Cloud" component={CloudScreen} />
    </Tab.Navigator>
  )
}

const MainStackNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* <Stack.Screen
          options={{
            headerShown: false
          }}
          name='SplashScreen'
          component={SplashScreen}
        /> */}

        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='MainTapNavigator'
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

        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='ViewCloudDataScreen'
          component={ViewCloudDataScreen}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="NewCloudScreen"
          component={NewCloudScreen}
        />


        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='SignupScreen'
          component={SignupScreen}
        />

        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='VerificationScreen'
          component={VerificationScreen}
        />

        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='LoginScreen'
          component={LoginScreen}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="ForgotPassword" component={ForgotPasswordScreen} />




        <Stack.Screen
          options={{
            headerShown: false
          }}
          name='CloudScreen'
          component={CloudScreen}
        />
      </Stack.Navigator>
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
});

export default App;
