import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, Modal, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import Checkbox from 'expo-checkbox';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { getItem } from '../../utils';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import WelcomeButton from '../../components/WelcomeButton';
import { BACKEND_URL } from '../../env';
import axios from 'axios';

export default function DocumentScreen() {
  const [documentFiles, setDocumentFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigation = useNavigation()
  const [sending, setSending] = useState(false)
  const [filename, setFilename] = useState("")

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };


  function getFilename(fileUrl) {
    let name = String(fileUrl).split('/')[9]
    // console.log(fileUrl)
    return name
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
      setFilename(name)
      console.log(uri)
      console.log(name)
      console.log(mimeType)

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        "type": mimeType,
      },)
      const share_channel_id = await getItem("share_channel_id")

      formData.append('share_channel_id', share_channel_id);

      setSending(true);

      axios.post(`${BACKEND_URL}/share/share-file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log(res.data)
        setSending(false);
        Alert.alert("Success", "File Sent.");
        navigation.navigate("MainTapNavigator")
      })
        .catch((err) => {
          console.error('Error uploading file:', err);
          Alert.alert("Error", "Failed Sending Failed.");
          navigation.navigate("MainTapNavigator")
        })
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.details} onPress={() => openDocument(item)}>
        <Text style={styles.title}>{item.filename || item.name}</Text>
      </TouchableOpacity>
      <Checkbox
        value={selectedFiles.includes(item.id)}
        onValueChange={() => handleSelectFile(item.id)}
      />
    </View>
  );



  return (
    <ImageBackground
      // source={require('./assets/byte.jpg')} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <MaterialIcons name={'lock'} size={50} color={"#004d40"} />
        <Text style={{ fontSize: 15, marginTop:30 }}>Documents are placed behind wall for security reasons..</Text>
        <WelcomeButton message="Share Document" onPress={handleUploadPress} />
      </View>

      <Modal visible={sending} transparent animationType="fade">
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            {/* <GeneralLoader /> */}
            {/* <ReceiveLoader /> */}
            <ActivityIndicator size={60} color="#004d40" />
            <Text style={styles.text}>Sending...</Text>
            <Text style={styles.text}>{filename}</Text>
          </View>
        </BlurView>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjust background opacity if needed
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    padding: 10,
    backgroundColor: 'transparent', // Make header transparent to see background image
    elevation: 2,
  },
  logo: {
    width: 40,
    height: 40,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
