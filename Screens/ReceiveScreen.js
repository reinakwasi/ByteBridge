import React, { useState, useEffect, } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, FlatList, Pressable, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native';
import ProfileButton from '../components/ProfileComponent';
import { FileSystem, shareAsync } from 'expo';
import { Platform } from 'react-native';
import ReceiveLoader from '../components/RecieveLoader';

let  SHARE_SERVER_URL = ""

const ReceiveScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(true)
  const [showRecievedFiles, setShowRecievedFiles] = useState(false)
  const [scannedData, setScannedData] = useState('');
  const [receiveFiles, setReceiveFiles] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState("Connecting")

  async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  }

  async function download() {
    const filename = "dummy.png";
    const result = await FileSystem.downloadAsync(
      "https://justgohealth-backend.onrender.com/media/images/default.png",
      FileSystem.documentDirectory + filename
    );
  
    // Log the download result
    console.log(result);
  
    // Save the downloaded file
    saveFile(result.uri, filename, result.headers["Content-Type"]);
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
    console.log(data)
    const ws = new WebSocket(SHARE_SERVER_URL);
    // download()
    console.log(data)

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setMessage("Waiting to receive files");
      Alert.alert("Connection has been made")
      };

      ws.onmessage = (event) => {
        setLoading(false);
        const receivedData = JSON.parse(event.data);
  
        Alert.alert(
          'Incoming File',
          `Accept file ${String(receivedData.file_name).slice(6)}?`,
          [
            {
              text: 'Reject',
              style: 'cancel',
              onPress: () => {
                console.log('File rejected');
                // Optionally send rejection message to backend
              },
            },
            {
              text: 'Accept',
              onPress: () => {
                console.log('File accepted');
                console.log(receivedData)
                setReceiveFiles(prevFiles => [...prevFiles, receivedData]);
                // initiateFileProcessing(data);      // serverMessagesList.push(e.data);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => audioOnPress(item)} style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.filename}>{item.file_name}</Text>
        {/* <TouchableOpacity onPress={() => audioOnPress(item)} style={styles.playButton}>
          <Icon
            type='antdesign'
            name={"play"} // Assuming 'playing' state is handled elsewhere
            size={24}
            color="black"
          />
        </TouchableOpacity> */}
        {/* <Text style={styles.duration}>{item.duration}</Text> */}
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {showRecievedFiles ? (
        isLoading ? (
          <View>
            <View style={styles.profileContainer} >
            <ProfileButton />
            <Text style={styles.profileText}>Me</Text>
            </View>
            <ReceiveLoader />
          </View>
        ) : (
          <View>
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
          {/* {scannedData ? <Text>{scannedData}</Text> : null} */}
        </View>
      )}
    </View>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "rgb(210, 255, 255)",
    alignItems: "center"
  },

  buttonStyle: {
    backgroundColor:"rgb(53,189,153)",
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
    alignItems:"center",
    padding: 30,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },

  description: {
    fontSize:20,
    textAlign:"center",
    marginTop:12
  },

  profileContainer:{
    display: "flex",
    flexDirection: "column",
    alignItems:"center"
  },

  profileText: {
    fontWeight:"600"
  },

  buttonText:{
    fontSize:20
  },

  scanner:{
    height:300,
    width: 300,
    // padding: 12
  }
});

export default ReceiveScreen;
