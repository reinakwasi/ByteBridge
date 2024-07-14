// import {   } from "react-native-qrcode-scanner";
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { useState } from "react";

// const ReceiveScreen = () => {
//   const [receiveFiles, setReceiveFiles] = useState([]);
  
  
//   let  SHARE_SERVER_URL = ""

//   useEffect(() => {
//     const ws = new WebSocket(SHARE_SERVER_URL);

//     ws.onopen = () => {
//       console.log('WebSocket connection opened');
//       setMessage("Waiting to receive files");
//     };

//     ws.onmessage = (event) => {
//       setLoading(false);
//       const receivedData = JSON.parse(event.data);

//       Alert.alert(
//         'Incoming File',
//         `Accept file ${String(receivedData.file_name).slice(6)}?`,
//         [
//           {
//             text: 'Reject',
//             style: 'cancel',
//             onPress: () => {
//               console.log('File rejected');
//             },
//           },
//           {
//             text: 'Accept',
//             onPress: () => {
//               console.log('File accepted');
//               console.log(receivedData)
//               setReceiveFiles(prevFiles => [...prevFiles, receivedData]);
//               // initiateFileProcessing(data);      // serverMessagesList.push(e.data);
//             },
//           },
//         ],
//         { cancelable: false }
//           );
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket Error:', error.message);
//       setMessage("WebSocket error occurred");
//       setLoading(false);
//     };

//     ws.onclose = (event) => {
//       console.log('WebSocket closed:', event.code, event.reason);
//       setMessage("WebSocket connection closed");
//       setLoading(false);
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);


//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => audioOnPress(item)} style={styles.container}>
//       <View style={styles.itemContainer}>
//         <Text style={styles.filename}>{item.file_name}</Text>
//         {/* <TouchableOpacity onPress={() => audioOnPress(item)} style={styles.playButton}>
//           <Icon
//             type='antdesign'
//             name={"play"} // Assuming 'playing' state is handled elsewhere
//             size={24}
//             color="black"
//           />
//         </TouchableOpacity> */}
//         {/* <Text style={styles.duration}>{item.duration}</Text> */}
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <View style={styles.screenContainer}>
//     {isLoading ? (
//       <Loader message={message} />
//     ) : (
//       <FlatList 
//         data={receiveFiles} 
//         renderItem={renderItem} 
//         // keyExtractor={item => item.file_name}
//         showsVerticalScrollIndicator={false}
//       />
//     )}
//     <StatusBar style="auto" />
//   </View>

//   )
// }

// export default ReceiveScreen

// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//     padding: 10,
//     paddingTop: 50,
//     backgroundColor: '#E5E5E5',
//   },
//   container: {
//     backgroundColor: '#FFFFFF',
//     marginBottom: 10,
//     padding: 10,
//     borderRadius: 5,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filename: {
//     flex: 1,
//     maxWidth: 200,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// })

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

let  SHARE_SERVER_URL = ""

const ReceiveScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(true)
  const [scannedData, setScannedData] = useState('');

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

    SHARE_SERVER_URL = data

    const ws = new WebSocket(SHARE_SERVER_URL);

    alert(`${data}`);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setMessage("Waiting to receive files");
      };
      
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {showScanner && (
        <View>
          <Text style={styles.description}>Scan To Connect...</Text>
          <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
            />
        </View>
      )    // You can handle scanned data here, such as sending it to an API or processing it further
      }
      {scanned && (
        <Pressable style={styles.buttonStyle} onPress={() => setShowScanner(true)}>
          <Text style={styles.buttonText}>Tap to Scan Again</Text>
        </Pressable>
      )}
      {/* {scannedData ? <Text>{scannedData}</Text> : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center"
  },

  buttonStyle: {
    backgroundColor:"'rgb(53,189,153)",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
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
