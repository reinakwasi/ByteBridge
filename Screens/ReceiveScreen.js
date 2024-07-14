import React, { useState, useEffect, } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, FlatList, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Loader from '../components/Loader';

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

    const ws = new WebSocket(SHARE_SERVER_URL);

    console.log(data)

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setMessage("Waiting to receive files");
      };

      // ws.onmessage = (event) => {
      //   setLoading(false);
      //   const receivedData = JSON.parse(event.data);
  
      //   Alert.alert(
      //     'Incoming File',
      //     `Accept file ${String(receivedData.file_name).slice(6)}?`,
      //     [
      //       {
      //         text: 'Reject',
      //         style: 'cancel',
      //         onPress: () => {
      //           console.log('File rejected');
      //           // Optionally send rejection message to backend
      //         },
      //       },
      //       {
      //         text: 'Accept',
      //         onPress: () => {
      //           console.log('File accepted');
      //           console.log(receivedData)
      //           setReceiveFiles(prevFiles => [...prevFiles, receivedData]);
      //           // initiateFileProcessing(data);      // serverMessagesList.push(e.data);
      //         },
      //       },
      //     ],
      //     { cancelable: false }
      //       );
      // };
  
      // ws.onerror = (error) => {
      //   console.error('WebSocket Error:', error.message);
      //   setMessage("WebSocket error occurred");
      //   setLoading(false);
      // };
  
      // ws.onclose = (event) => {
      //   console.log('WebSocket closed:', event.code, event.reason);
      //   setMessage("WebSocket connection closed");
      //   setLoading(false);
      // };
  
  
      
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
          <Loader message={message} />
        ) : (
          <FlatList 
            data={receiveFiles} 
            renderItem={renderItem} 
            keyExtractor={item => item.file_name}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <View>
          {showScanner && (
            <View style={styles.scannerContainer}>
              <Text style={styles.description}>Scan To Connect...</Text>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
              />
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
    flexDirection: 'column',
    justifyContent: 'center',
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
    backgroundColor: "rgb(53,189,153)",
    padding: 12,
    borderRadius: 12,
  },

  description: {
    fontSize:20,
    textAlign:"center",
    marginBottom:12
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
