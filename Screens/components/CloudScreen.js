import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Linking, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { BACKEND_URL } from '../../env';
import { BlurView } from 'expo-blur';
import { Video } from 'expo-av';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import CloudLoader from '../../components/CloudLoader';
import CloudWelcome from '../../components/CloudWelcome';
import WelcomeButton from '../../components/WelcomeButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import ProfileButton from '../../components/ProfileComponent';
import { handleShare } from '../../utils';

const CloudScreen = () => {
  const [userData, setUserData] = useState(null);
  const [fileReady, setFileReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null)
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("Loading Files");
  const [contentList, setContentList] = useState([]);
  const [showCloudWelcome, setShowCloudWelcome] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);


  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };


  function getFilename(fileUrl) {
    let name = String(fileUrl).split('/')[9]
    // console.log(fileUrl)
    return name
  }

  function provideFullPath(fileUrl) {
    const fileUrlPath = `${BACKEND_URL}${fileUrl}`
    console.log(fileUrlPath)
    return fileUrlPath
  }

  async function logout(params) {
    const token = await AsyncStorage.setItem('token', "");
    navigation.navigate("LoginScreen")
  }

  const ViewData = (dataUrl) => {
    // alert(dataUrl)
    navigation.navigate("ViewCloudDataScreen", { fileUrl: dataUrl })
  }

  const handleUploadPress = async () => {
    console.log("Upload button pressed");

    const result = await DocumentPicker.getDocumentAsync({});

    // console.log(result)  

    if (result) {
      const data = result.assets[0]
      console.log("data", data)
      const { uri, name, mimeType } = data;

      const extension = getFileExtension(name);

      console.log(uri)
      console.log(name)
      console.log(mimeType)

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        "type": mimeType,
      },)

      formData.append('file_type', "others");

      setLoading(true);
      setLoadingMessage("Uploading...")
      const token = await AsyncStorage.getItem('token');

      axios.post(`${BACKEND_URL}/cloud/upload-file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        console.log(res.data)
        setLoading(false);
        Alert.alert("Success", "File uploaded successfully.");
        fetchUserContent(token); // Refresh content after upload
      })
        .catch((err) => {
          setLoading(false);
          console.error('Error uploading file:', err);
          Alert.alert("Error", "Failed to upload file.");
        })
    }
  };
  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this file?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            setLoadingMessage("Deleting...")
            const token = await AsyncStorage.getItem('token');
            axios.delete(`${BACKEND_URL}/cloud/delete/${id}/`)
              .then((res) => {
                alert(res.data.detail);
                fetchUserContent(token);
                setLoading(false);
              })
              .catch((err) => {
                console.log(err)
                alert("File Deletion Failed");
                fetchUserContent(token);
                setLoading(false);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const fetchUserData = async () => {
    setMessage("Loading Files")
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate("LoginScreen");
      } else {
        setShowCloudWelcome(false);
        fetchUserContent(token);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserContent = async (token) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/cloud/get-files/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      if (data.length === 0) {
        setMessage("No Files in your Cloud");
        setFileReady(false);
      } else {
        console.log(data)
        setFileReady(true);
        setContentList(data);
      }
    } catch (err) {
      setFileReady(false)
      setMessage("Files Unavailable");
      console.error(err);
    }
  };

  const renderContentItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <MaterialIcons name={"description"} size={33} color={'#004d40'} />
        {/* // <Image source={{ uri: item.uri }} style={styles.thumbnail} /> */}
        <TouchableOpacity style={styles.details}
          onPress={() => ViewData(item.file)}
        >
          <Text style={styles.title}>{getFilename(item.file)}</Text>
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row" }}>

          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => ViewData(item.file)}>
            <MaterialIcons name={"file-open"} size={33} color={'#004d40'} />
          </TouchableOpacity>

          <TouchableOpacity onLongPress={() => handleDelete(item.pk)}>
            <MaterialIcons name={"delete"} size={33} color={'#5e190d'} />
          </TouchableOpacity>
        </View>

      </View>
    )
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  if (showCloudWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <StatusBar style="auto" />
        <Text style={styles.welcomeText}>Welcome To ByteBridge Cloud Services</Text>
        <CloudWelcome />
        <WelcomeButton
          message={"Start Your Cloud Storage"}
          onPress={() => navigation.navigate("SignupScreen")}
        />

      </View>
    );
  } else if (!fileReady) {
    return (
      <View style={styles.loaderContainer}>
        <StatusBar style="auto" />
        <CloudLoader message={message} />
        {/* <WelcomeButton
          message={"Load Files"}
          onPress={fetchUserData}
        /> */}

        <WelcomeButton
          message={"Upload File"}
          onPress={handleUploadPress}
        />

        <WelcomeButton
          message={"Reload"}
          onPress={logout}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <ProfileButton />

          <Pressable onPress={logout}>
            <Icon name="logout" size={30} color="#004d40" />
          </Pressable>
        </View>

        <StatusBar style="auto" />
        {/* <Text style={styles.title}>Welcome, Wica!</Text> */}
        <FlatList
          data={contentList}
          keyExtractor={(item) => item.id}
          renderItem={renderContentItem}
        />

        <TouchableOpacity style={styles.floatingButton} onPress={handleUploadPress}>
          <Icon name="upload" size={24} color="#fff" />
        </TouchableOpacity>

      </View>

      <Modal visible={loading} transparent animationType="fade">
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            {/* <GeneralLoader /> */}
            {/* <ReceiveLoader /> */}
            <ActivityIndicator size={60} color="#004d40" />
            <Text style={styles.text}>{loadingMessage}</Text>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 11,
    // alignItems:"center",
    justifyContent: "center",
    backgroundColor: "rgb(227, 255, 255)",
  },

  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 30,
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    height: 70,
    borderRadius: 40,
    padding: 15,
    backgroundColor: 'white',
    elevation: 5,
  },
  logo: {
    width: 40,
    height: 40,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    marginEnd: 10,
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
    // backgroundColor: "#88fdc7",
    borderBottomColor: '#f0f0f0',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#d9d9d9',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },

  size: {
    fontSize: 14,
    color: '#888',
  },

  welcomeContainer: {
    flex: 1,
    backgroundColor: "rgb(227, 255, 255)",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(227, 255, 255)",
    padding: 16,
  },
  title: {
    fontSize: 15,
    width: 150,
    paddingLeft: 12,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  contentItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: 200,
  },
  documentText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    padding: 16,
  },
  audioText: {
    fontSize: 16,
    color: 'green',
    textDecorationLine: 'underline',
    padding: 16,
  },
  unknownText: {
    fontSize: 16,
    color: '#888',
    padding: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },

  floatingButton: {
    position: 'absolute',
    bottom: 140,
    right: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#004d40',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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

export default CloudScreen;
