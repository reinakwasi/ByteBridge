// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// // import Checkbox from 'expo-checkbox';
// // import { Audio } from 'expo-av';
// // import * as MediaLibrary from 'expo-media-library';
// // import { Feather, MaterialIcons } from '@expo/vector-icons';

// // export default function AudioScreen() {
// //   const [audioFiles, setAudioFiles] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [sound, setSound] = useState(null);
// //   const [playingUri, setPlayingUri] = useState(null);

// //   useEffect(() => {
// //     const getPermissions = async () => {
// //       const { status } = await MediaLibrary.requestPermissionsAsync();
// //       if (status !== 'granted') {
// //         alert('Permission to access media library is required!');
// //         return;
// //       }
// //       loadAudioFiles();
// //     };
// //     getPermissions();
// //   }, []);

// //   const loadAudioFiles = async () => {
// //     const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
// //     setAudioFiles(media.assets);
// //   };

// //   const playSound = async (uri) => {
// //     if (sound) {
// //       await sound.unloadAsync();
// //       setSound(null);
// //       if (playingUri === uri) {
// //         setPlayingUri(null);
// //         return;
// //       }
// //     }
// //     const { sound: newSound } = await Audio.Sound.createAsync({ uri });
// //     setSound(newSound);
// //     setPlayingUri(uri);
// //     await newSound.playAsync();
// //   };

// //   const handleSelectFile = (id) => {
// //     if (selectedFiles.includes(id)) {
// //       setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
// //     } else {
// //       setSelectedFiles([...selectedFiles, id]);
// //     }
// //   };

// //   const renderItem = ({ item }) => {
// //     const fileSizeMB = item.size ? (item.size / 1048576).toFixed(2) + ' MB' : 'MB';

// //     return (
// //       <View style={styles.itemContainer}>
// //         <Image source={{ uri: item.uri }} style={styles.thumbnail} />
// //         <TouchableOpacity style={styles.details} onPress={() => playSound(item.uri)}>
// //           <Text style={styles.title}>{item.filename}</Text>
// //           <Text style={styles.size}>{fileSizeMB}</Text>
// //         </TouchableOpacity>
// //         <Checkbox
// //           value={selectedFiles.includes(item.id)}
// //           onValueChange={() => handleSelectFile(item.id)}
// //         />
// //       </View>
// //     );
// //   };

// //   const filteredAudioFiles = audioFiles.filter(file =>
// //     file.filename.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   return (
// //     <ImageBackground
// //       // source={require('./assests/byte.jpg')} // Replace with your background image
// //       style={styles.backgroundImage}
// //     >
// //       <View style={styles.container}>
// //         <View style={styles.header}>
// //           <Image source={require('../../assests/logo.png')} style={styles.logo} />
// //           <TextInput
// //             style={styles.searchBar}
// //             placeholder="Search audio"
// //             value={searchQuery}
// //             onChangeText={setSearchQuery}
// //           />
          
// //         </View>
// //         <FlatList
// //           data={filteredAudioFiles}
// //           renderItem={renderItem}
// //           keyExtractor={item => item.id}
// //         />
// //         {/* <View style={styles.bottomMenu}>
// //           <TouchableOpacity style={styles.menuButton}>
// //             <MaterialIcons name="photo" size={24} color="black" />
// //             <Text>PHOTO</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.menuButton}>
// //             <MaterialIcons name="apps" size={24} color="black" />
// //             <Text>APP</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.menuButton}>
// //             <MaterialIcons name="video-library" size={24} color="black" />
// //             <Text>VIDEO</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.menuButton}>
// //             <MaterialIcons name="music-note" size={24} color="black" />
// //             <Text>AUDIO</Text>
// //           </TouchableOpacity>
// //         </View> */}
// //       </View>
// //     </ImageBackground>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjust background opacity if needed
   
// //     },
// //   backgroundImage: {
// //     flex: 1,
// //     resizeMode: 'cover', // or 'stretch' or 'contain'
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 35,
// //     shadowColor:'green',
// //     shadowOffset:{width:0,height:6},
// //     shadowOpacity:0.8,
// //     shadowRadius:2,
// //     borderRadius:40,
// //     padding: 15,
// //     backgroundColor: 'white', // Make header transparent to see background image
// //     elevation: 5,
// //   },
// //   logo: {
// //     width: 40,
// //     height: 40,
// //   },
// //   searchBar: {
// //     flex: 1,
// //     marginHorizontal: 10,
// //     marginEnd:50,
// //     borderRadius: 10,
// //     padding: 8,
// //     backgroundColor: '#f0f0f0',
// //   },
// //   itemContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //   },
// //   thumbnail: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 5,
// //     backgroundColor: '#d9d9d9',
// //   },
// //   details: {
// //     flex: 1,
// //     marginLeft: 10,
// //   },
// //   title: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   size: {
// //     fontSize: 14,
// //     color: '#888',
// //   },
// //   bottomMenu: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     paddingVertical: 10,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f0',
// //   },
// //   menuButton: {
// //     alignItems: 'center',
// //   },
// // });



// // AudioScreen.js




// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// import Checkbox from 'expo-checkbox';
// import { Audio } from 'expo-av';
// import * as MediaLibrary from 'expo-media-library';
// import { Feather, MaterialIcons } from '@expo/vector-icons';

// export default function AudioScreen() {
//   const [audioFiles, setAudioFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [sound, setSound] = useState(null);
//   const [playingUri, setPlayingUri] = useState(null);
//   const [selectAll, setSelectAll] = useState(false);

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

//   const handleSelectFile = (id) => {
//     if (selectedFiles.includes(id)) {
//       setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
//     } else {
//       setSelectedFiles([...selectedFiles, id]);
//     }
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
//           value={selectedFiles.includes(item.id)}
//           onValueChange={() => handleSelectFile(item.id)}
//         />
//       </View>
//     );
//   };

//   const filteredAudioFiles = audioFiles.filter(file =>
//     file.filename.toLowerCase().includes(searchQuery.toLowerCase())
//   );

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
//     shadowColor:'green',
//     shadowOffset:{width:0,height:6},
//     shadowOpacity:0.8,
//     shadowRadius:2,
//     borderRadius:40,
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
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//     backgroundColor: '#e0e0e0',
//   },
//   selectButtonActive: {
//     backgroundColor: 'green',
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
// });



import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';

export default function AudioScreen() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sound, setSound] = useState(null);
  const [playingUri, setPlayingUri] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleSelectFile = (id) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
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
          value={selectedFiles.includes(item.id)}
          onValueChange={() => handleSelectFile(item.id)}
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
    <ImageBackground
      // source={require('./assests/byte.jpg')} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assests/logo.png')} style={styles.logo} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search audio"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjust background opacity if needed
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
    marginEnd: 50,
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
    marginTop:15,
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
    backgroundColor: 'rgb(53,189,153)',
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
});


