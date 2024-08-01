// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// import Checkbox from 'expo-checkbox';
// import { Audio } from 'expo-av';
// import * as MediaLibrary from 'expo-media-library';
// import { MaterialIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { getAudioType } from '../../utils';
// import ProfileButton from '../../components/ProfileComponent';
// import { handleShare } from '../../utils';


// export default function AudioScreen() {
//   const [audioFiles, setAudioFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [sound, setSound] = useState(null);
//   const [playingUri, setPlayingUri] = useState(null);
//   const [selectAll, setSelectAll] = useState(false);


//   const ShuffleButtonComponent = () => {
//     const navigation = useNavigation()

//     const [showPopUp, setShowPopUp] = useState(false);

//     const handleShufflePress = () => {
//       setShowPopUp(!showPopUp);
//     };

//     const handleSendOnPress = () => {
//       if (selectedFiles.length==0){
//         navigation.navigate("SendRequestScreen")
//       }
//       console.log(selectedFiles)
//       for (var file of selectedFiles){
//         handleShare(file, getAudioType)
//       }
//       console.log("sending")
//     }

//     return (
//       <View>
//       <View style={styles.shuffleButtonContainer}>
//         <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
//           <AntDesign name="swap" size={32} color="white" />
//         </TouchableOpacity>
//       </View>

//       {showPopUp && (
//         <View style={styles.popUpContainer}>
//           <TouchableOpacity style={styles.popUpButton} onPress={handleSendOnPress}>
//             <AntDesign name="upload" size={24} color="black" />
//             <Text style={styles.popUpText}>Send</Text>
//           </TouchableOpacity>
//           <View style={styles.spaceBetweenButtons} />
//           <TouchableOpacity style={styles.popUpButton} onPress={() => navigation.navigate("ReceiveScreen")}>
//             <AntDesign name="download" size={24} color="black" />
//             <Text style={styles.popUpText}>Receive</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       </View>
//     )
// }

//   useEffect(() => {
//     const getPermissions = async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access media library is required!');
//         return;
//       }
//       loadAudioFiles();
//     };
//     getPermissions();
//   }, []);

//   const loadAudioFiles = async () => {
//     const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
//     console.log('Fetched audio files:', media.assets);
//     setAudioFiles(media.assets);
//   };

//   const playSound = async (uri) => {
//     if (sound) {
//       await sound.unloadAsync();
//       setSound(null);
//       if (playingUri === uri) {
//         setPlayingUri(null);
//         return;
//       }
//     }
//     const { sound: newSound } = await Audio.Sound.createAsync({ uri });
//     setSound(newSound);
//     setPlayingUri(uri);
//     await newSound.playAsync();
//   };


//   const handleSelectFile = (item) => {
//     if (isSelected(item)) {
//       setSelectedFiles(selectedFiles.filter(file => file.id !== item.id));
//     } else {
//       setSelectedFiles([...selectedFiles, item]);
//     }
//   };
  
//   const isSelected = (item) => {
//     return selectedFiles.includes(photo => photo.id === item.id);
//   };
  
//   const handleToggleSelectAll = () => {
//     if (selectAll) {
//       setSelectedFiles([]);
//     } else {
//       setSelectedFiles(audioFiles.map(file => file.id));
//     }
//     setSelectAll(!selectAll);
//   };

//   const renderItem = ({ item }) => {
//     const fileSizeMB = item.size ? (item.size / 1048576).toFixed(2) + ' MB' : 'Unknown size';

//     return (
//       <View style={styles.itemContainer}>
//         <Image source={{ uri: item.uri }} style={styles.thumbnail} />
//         <TouchableOpacity style={styles.details} onPress={() => playSound(item.uri)}>
//           <Text style={styles.title}>{item.filename}</Text>
//           <Text style={styles.size}>{fileSizeMB}</Text>
//         </TouchableOpacity>
//         <Checkbox
//           value={selectedFiles.includes(item)}
//           onValueChange={() => handleSelectFile(item)}
//         />
//       </View>
//     );
//   };

//   const filteredAudioFiles = audioFiles.filter(file =>
//     file.filename.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   console.log('Total audio files:', audioFiles.length);
//   console.log('Filtered audio files:', filteredAudioFiles.length);
//   console.log('Selected audio files:', selectedFiles.length);

//   return (
//     <ImageBackground
//       // source={require('./assests/byte.jpg')} // Replace with your background image
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Image source={require('../../assests/logo.png')} style={styles.logo} />
//           <TextInput
//             style={styles.searchBar}
//             placeholder="Search audio"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           <ProfileButton />
//         </View>
//         <View style={styles.selectAllContainer}>
//           <TouchableOpacity style={[styles.selectButton, selectAll && styles.selectButtonActive]} onPress={handleToggleSelectAll}>
//             <MaterialIcons name="library-music" size={24} color={selectAll ? 'white' : 'black'} />
//             <Text style={selectAll ? styles.selectButtonTextActive : styles.selectButtonText}>{audioFiles.length}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.selectButton, selectedFiles.length > 0 && styles.selectButtonActive]}>
//             <MaterialIcons name="queue-music" size={24} color={selectedFiles.length > 0 ? 'white' : 'black'} />
//             <Text style={selectedFiles.length > 0 ? styles.selectButtonTextActive : styles.selectButtonText}>{selectedFiles.length}</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={filteredAudioFiles}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//         />
//       </View>
//       <ShuffleButtonComponent />
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjust background opacity if needed
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover', // or 'stretch' or 'contain'
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 35,
//     shadowColor: 'green',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     borderRadius: 40,
//     padding: 15,
//     backgroundColor: 'white', // Make header transparent to see background image
//     elevation: 5,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//   },
//   searchBar: {
//     flex: 1,
//     marginHorizontal: 10,
//     marginEnd: 50,
//     borderRadius: 10,
//     padding: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   selectAllContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     backgroundColor: 'white',
//     borderBottomWidth: 9,
//     marginTop:15,
//     borderBottomColor: '#f0f0f0',
//   },
//   selectButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 50,
//     paddingVertical: 10,
//     borderRadius: 10,
//     backgroundColor: '#e0e0e0',
//   },
//   selectButtonActive: {
//     backgroundColor: 'rgb(53,189,153)',
//   },
//   selectButtonText: {
//     marginLeft: 10,
//     color: 'black',
//   },
//   selectButtonTextActive: {
//     marginLeft: 10,
//     color: 'white',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   thumbnail: {
//     width: 50,
//     height: 50,
//     borderRadius: 5,
//     backgroundColor: '#d9d9d9',
//   },
//   details: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   size: {
//     fontSize: 14,
//     color: '#888',
//   },


//   // shufle buttons
//   shuffleButtonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//   },

//   shuffleButton: {
//     backgroundColor: 'rgb(53,189,153)',
//     padding: 10,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   popUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 20,
//     position: 'absolute',
//     bottom: 90,
//     alignSelf: 'center',
//   },

//   popUpButton: {
//     backgroundColor: 'rgb(53,189,153)',
//     padding: 8,// Navigate to SendRequestScreen
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   popUpText: {
//     color: 'black',
//     fontSize: 16,
//     marginLeft: 5, // Add some space between icon and text
//   },
//   spaceBetweenButtons: {
//     width: 30,
//     marginEnd: 10,
//   },
  
// });







import React, { useEffect, useState } from 'react';
import { View, Modal, Text, ActivityIndicator, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAudioType } from '../../utils';
import ProfileButton from '../../components/ProfileComponent';
import { handleShare } from '../../utils';
import { BlurView } from 'expo-blur';
import { RadioButton, } from 'react-native-paper';
//import Checkbox from '@react-native-community/checkbox';
import Checkbox from 'expo-checkbox';



export default function AudioScreen() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sending, setSending] = useState(false)
  const [sound, setSound] = useState(null);
  const [playingUri, setPlayingUri] = useState(null);
  const [filename, setFilename] = useState(null)
  const [selectAll, setSelectAll] = useState(false);

  const ShuffleButtonComponent = () => {
    const navigation = useNavigation();

    const [showPopUp, setShowPopUp] = useState(false);

    const handleShufflePress = () => {
      setShowPopUp(!showPopUp);
    };

    const handleSendOnPress = () => {
      if (selectedPhotos.length == 0) {
        navigation.navigate("SendRequestScreen")
      }   
      console.log(selectedPhotos)
      for (var file of selectedPhotos) {
        setSending(true)
        setFilename(file.filename)
        handleShare(file, getAudioType)
        .then(() => {
          setSending(false)
          Alert.alert(`${file.filename} sent`)
        })
        .catch(() => {
          setSending(false)
          Alert.alert("File sharing failed")
        })
      }
      console.log("sending")
    };

    return (
      <View>
      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
          <AntDesign name="swap" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* {showPopUp && (
        <View style={styles.popUpContainer}>
          <TouchableOpacity style={styles.popUpButton} onPress={handleSendOnPress}>
            <AntDesign name="upload" size={24} color="white" />
            <Text style={styles.popUpText}>Send</Text>
          </TouchableOpacity>
          <View style={styles.spaceBetweenButtons} />
          <TouchableOpacity style={styles.popUpButton} onPress={() => navigation.navigate("ReceiveScreen")}>
            <AntDesign name="download" size={24} color="white" />
            <Text style={styles.popUpText}>Receive</Text>
          </TouchableOpacity>
        </View> */}

        {showPopUp && (
          <View style={styles.popUpContainer}>
            <TouchableOpacity style={styles.popUpButton} onPress={handleSendOnPress}>
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
    );
  };

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
      loadAudioFiles();
    };
    getPermissions();
  }, []);

  const loadAudioFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
    console.log('Fetched audio files:', media.assets);
    setAudioFiles(media.assets);
  };

  const playSound = async (uri) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      if (playingUri === uri) {
        setPlayingUri(null);
        return;
      }
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setPlayingUri(uri);
    await newSound.playAsync();
  };

  const handleSelectFile = (item) => {
    if (isSelected(item)) {
      setSelectedFiles(selectedFiles.filter(file => file.id !== item.id));
    } else {
      setSelectedFiles([...selectedFiles, item]);
    }
  };

  const isSelected = (item) => {
    return selectedFiles.some(file => file.id === item.id);
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(audioFiles.map(file => file.id));
    }
    setSelectAll(!selectAll);
  };

  const renderItem = ({ item }) => {
    const fileSizeMB = item.size ? (item.size / 1048576).toFixed(2) + ' MB' : 'Unknown size';

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        <TouchableOpacity style={styles.details} onPress={() => playSound(item.uri)}>
          <Text style={styles.title}>{item.filename}</Text>
          <Text style={styles.size}>{fileSizeMB}</Text>
        </TouchableOpacity>
        <Checkbox
          style = {{borderRadius: 50}}
          value={selectedFiles.includes(item)}
          onValueChange={() => handleSelectFile(item)}
        />
      </View>
    );
  };

  const filteredAudioFiles = audioFiles.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Total audio files:', audioFiles.length);
  console.log('Filtered audio files:', filteredAudioFiles.length);
  console.log('Selected audio files:', selectedFiles.length);

  return (
    <>
    <ImageBackground
      // source={require('./assests/byte.jpg')} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search audio"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ProfileButton />
        </View>
        <View style={styles.selectAllContainer}>
          <TouchableOpacity style={[styles.selectButton, selectAll && styles.selectButtonActive]} onPress={handleToggleSelectAll}>
            <MaterialIcons name="library-music" size={24} color={selectAll ? 'white' : 'black'} />
            <Text style={selectAll ? styles.selectButtonTextActive : styles.selectButtonText}>{audioFiles.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectButton, selectedFiles.length > 0 && styles.selectButtonActive]}>
            <MaterialIcons name="queue-music" size={24} color={selectedFiles.length > 0 ? 'white' : 'black'} />
            <Text style={selectedFiles.length > 0 ? styles.selectButtonTextActive : styles.selectButtonText}>{selectedFiles.length}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredAudioFiles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <ShuffleButtonComponent />

    </ImageBackground>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(247, 255, 255)', // Adjust background opacity if needed
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 40,
    padding: 15,
    backgroundColor: 'white', // Make header transparent to see background image
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
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 9,
    marginTop: 15,
    borderBottomColor: '#f0f0f0',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  selectButtonActive: {
    backgroundColor: '#004d40',
  },
  selectButtonText: {
    marginLeft: 10,
    color: 'black',
  },
  selectButtonTextActive: {
    marginLeft: 10,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  size: {
    fontSize: 14,
    color: '#888',
  },

  // shufle buttons
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },

  shuffleButton: {
    backgroundColor: '#004d40',
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
    bottom: 90,
    alignSelf: 'center',
  },

  popUpButton: {
    backgroundColor: '#004d40',
    padding: 8,// Navigate to SendRequestScreen
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popUpText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5, // Add some space between icon and text
  },
  spaceBetweenButtons: {
    width: 30,
    marginEnd: 10,
  },
});


