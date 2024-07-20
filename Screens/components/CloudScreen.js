import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../env';
import { Video } from 'expo-av'; 
import { useNavigation } from '@react-navigation/native';
import CloudLoader from '../../components/CloudLoader';
import CloudWelcome from '../../components/CloudWelcome';
import WelcomeButton from '../../components/WelcomeButton';

const CloudScreen = () => {
  const [userData, setUserData] = useState(null);
  const [fileReady, setFileReady] = useState(false)
  const [message, setMessage] = useState("Loading")
  const [contentList, setContentList] = useState([]);
  const [showCloudWelcome, setShowCloudWelcome] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token){
        navigation.navigate("LoginScreen")
      }
      else{
      fetchUserContent(token); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserContent = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/cloud/get-files/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setContentList(data);
      } else if (response.status==401){
        navigation.navigate("LoginScreen")
      }
      else {
        // Handle error
        console.error('Failed to fetch user content');
      }
    } catch (error) {
      console.error('Error fetching user content:', error);
    }
  };

  const renderContentItem = ({ item }) => {
    switch (item.type) {
      case 'image':
        return (
          <View style={styles.contentItem}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        );
      case 'document':
        return (
          <TouchableOpacity onPress={() => handleOpenLink(item.url)} style={styles.contentItem}>
            <Text style={styles.documentText}>{item.title}</Text>
          </TouchableOpacity>
        );
      case 'video':
        return (
          <View style={styles.contentItem}>
            <Video
              source={{ uri: item.url }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          </View>
        );
      case 'audio':
        return (
          <View style={styles.contentItem}>
            <TouchableOpacity onPress={() => handleOpenLink(item.url)}>
              <Text style={styles.audioText}>{item.title}</Text>
            </TouchableOpacity> 
          </View>
        );
      default:
        return (
          <View style={styles.contentItem}>
            <Text style={styles.unknownText}>Unsupported Content Type: {item.type}</Text>
          </View>
        );
    }
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  if(showCloudWelcome){
    return (
    <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome To ByteBridge Cloud Services</Text>
        <CloudWelcome />
        <WelcomeButton onPress={() => navigation.navigate("SignupScreen")} />
    </View>
    )
  }
  else if (!fileReady) {
    return (
      <View style={styles.container}>
        <CloudLoader message={message} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Wica!</Text>
      <FlatList
        data={contentList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContentItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  welcomeContainer: {
    flex: 1,
    backgroundColor: "rgb(227, 255, 255)",
    justifyContent: 'center',

    alignItems: 'center',
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentItem: {
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },

  welcomeText:{
    fontSize: 35,
  },

  documentText: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  video: {
    width: 300,
    height: 200,
  },
  audioText: {
    fontSize: 18,
    color: 'green',
    textDecorationLine: 'underline',
  },
});

export default CloudScreen;
