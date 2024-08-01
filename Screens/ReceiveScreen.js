import React, { useState, useEffect, } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, FlatList, Pressable, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native';
import ProfileButton from '../components/ProfileComponent';
import { shareAsync } from "expo-sharing";
import { Platform, Modal } from 'react-native';
import ReceiveLoader from '../components/RecieveLoader';
import * as FileSystem from 'expo-file-system'
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

let SHARE_SERVER_URL = ""

const ReceiveScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(true)
  const [showRecievedFiles, setShowRecievedFiles] = useState(false)
  const [scannedData, setScannedData] = useState('');
  const [receiveFiles, setReceiveFiles] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [loading, setRLoading] = useState(false);
  const [message, setMessage] = useState("Connecting")

  const navigation = useNavigation()

  const save = async (uri, filename, mimetype) => {
    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
    if (permission.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, filename, mimetype)
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        })
        .catch(e => console.log(e));
    }
  }


  const ViewData = (item) => {
    const fileUrl = `https:${item.file_url.split(':').pop()}`
    navigation.navigate("ViewCloudDataScreen", { fileUrl: fileUrl })
  }

  function getFileName(uri) {
    return String(uri).split('/').pop()
  }

  const downloadFile = async (sourceUri) => {
    const source = String(sourceUri)
    setRLoading(true)
    console.log("src", source)
    if (Platform.OS == "android") {
      FileSystem.downloadAsync(
        source,
        FileSystem.documentDirectory + getFileName(source)
      )
        .then((result) => {
          console.log(result)
          console.log(result.uri, getFileName(result.uri), result.headers["content-type"])
          save(result.uri, getFileName(result.uri), result.headers["content-type"])
          console.log("ok", result)
          setRLoading(false)
        })
        .catch((err) => {
          console.log("ERR", err)
          setRLoading(false)
        })
    }
    shareAsync(sourceUri)
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    setShowScanner(false)
    setShowRecievedFiles(true)
    setLoading(true)

    SHARE_SERVER_URL = data
    console.log("data", data)
    const ws = new WebSocket(SHARE_SERVER_URL);
    // download()
    console.log(data)

    ws.onopen = () => {
      console.log('recieve scrren ready');
      setMessage("Waiting to receive files");
      Alert.alert("Connection has been made")
    };

    ws.onmessage = (event) => {
      setLoading(false);
      const receivedData = JSON.parse(event.data);
      const fileUrl = `https:${receivedData.file_url.split(':').pop()}`
      console.log("message", fileUrl)
      Alert.alert(
        'Incoming File',
        `Accept file ${String(receivedData.file_name).slice(6)}?`,
        [
          {
            text: 'Reject',
            style: 'cancel',
            onPress: () => {
              console.log('File rejected');
            },
          },

          {
            text: 'Accept',
            onPress: async () => {
              setReceiveFiles(prevFiles => [...prevFiles, receivedData]);
              await downloadFile(fileUrl)
            },
          },
        ],
        { cancelable: false }
      );
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error.message);
      setMessage("WebSocket error occurred");
      setLoading(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setMessage("WebSocket connection closed");
      setLoading(false);
    };
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => ViewData(item)}>
          <MaterialIcons name={"file-open"} size={33} color={'#004d40'} />
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => ViewData(item)}
        >
          <Text style={styles.title}>{item.file_name}</Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <ImageBackground source={require('../assets/byte.jpg')} style={styles.container}>
      {showRecievedFiles ? (
        isLoading ? (
          <View>
            <View style={styles.profileContainer} >
              <ProfileButton />
              <Text style={styles.profileText}>Me</Text>
            </View>
            <ReceiveLoader message={"Waiting To Recieve Files"} />
          </View>
        ) : (
          <View style={{ padding: 12, paddingTop: 240, }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Recieve Files</Text>
            <FlatList
              data={receiveFiles}
              renderItem={renderItem}
              keyExtractor={item => item.file_name}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )
      ) : (
        <View>
          {showScanner && (
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
              />
              <Text style={styles.description}>Scan To Connect...</Text>
            </View>
          )}
          {scanned && (
            <Pressable style={styles.buttonStyle} onPress={() => setShowScanner(true)}>
              <Text style={styles.buttonText}>Tap to Scan Again</Text>
            </Pressable>
          )}
        </View>
      )}

      <Modal visible={loading} transparent animationType="fade">
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size={60} color="#004d40" />
            <Text style={styles.text}>Receiving...</Text>
          </View>
        </BlurView>
      </Modal>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "rgb(210, 255, 255)",
    alignItems: "center"
  },

  buttonStyle: {
    backgroundColor: "rgb(53,189,153)",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },

  scannerContainer: {
    backgroundColor: "rgb(210, 255, 255)",
    padding: 12,
    marginTop: 40,
    width: 330,
    alignItems: "center",
    padding: 30,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },

  description: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 12
  },

  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  profileText: {
    fontWeight: "600"
  },

  buttonText: {
    fontSize: 20
  },

  scanner: {
    height: 300,
    width: 300,
    // padding: 12
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign:"center",
    color: '#333',
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

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 100,
    marginTop: 12,
    height: 75,
    // width:"auto",
    borderRadius: 12,
    borderBottomWidth: 1,
    backgroundColor: "#88fdc7",
    // borderBottomColor: '#f0f0f0',
  },

});

export default ReceiveScreen;
