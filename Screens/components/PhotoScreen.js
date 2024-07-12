// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, FlatList, Image, TextInput, StyleSheet, showHeader,TouchableOpacity, ImageBackground, PanResponder } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
// import { Feather, MaterialIcons } from '@expo/vector-icons';
// import { Photo } from 'expo-av';
// import Checkbox from 'expo-checkbox';

// export default function PhotoScreen() {
//   const [photoFiles, setPhotoFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedPhotos, setSelectedPhotos] = useState([]);
//   const [viewingPhoto, setViewingPhoto] = useState(null);
//   const panResponder = useRef(null);

//   useEffect(() => {
//     const getPermissions = async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access media library is required!');
//         return;
//       }
//       loadPhotoFiles();
//     };
//     getPermissions();
//   }, []);

//   useEffect(() => {
//     panResponder.current = PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         setViewingPhoto(null);
//       },
//     });
//   }, []);

//   const loadPhotoFiles = async () => {
//     const media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
//     setPhotoFiles(media.assets);
//   };

//   const handlePhotoPress = (uri) => {
//     setViewingPhoto(uri);
//   };

//   const handleSelectPhoto = (id) => {
//     if (selectedPhotos.includes(id)) {
//       setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
//     } else {
//       setSelectedPhotos([...selectedPhotos, id]);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const fileSizeMB = item.width && item.height ? `${item.width}x${item.height}` : 'Unknown';

//     return (
//       <View style={styles.itemContainer}>
//         <TouchableOpacity style={styles.thumbnailContainer} onPress={() => handlePhotoPress(item.uri)}>
//           <Image source={{ uri: item.uri }} style={styles.thumbnail} />
//         </TouchableOpacity>
//         <View style={styles.details}>
//           <Text style={styles.title}>{item.filename}</Text>
//           <Text style={styles.size}>{fileSizeMB}</Text>
//         </View>
//         <Checkbox
//           value={selectedPhotos.includes(item.id)}
//           onValueChange={() => handleSelectPhoto(item.id)}
//         />
//       </View>
//     );
//   };

//   const filteredPhotoFiles = photoFiles.filter(file =>
//     file.filename.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <ImageBackground
//       style={styles.backgroundImage}
//     //   source={require('./assets/byte.jpg')} // Replace with your background image
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Image source={require('../../assests/logo.png')} style={styles.logo} />
//           <TextInput
//             style={styles.searchBar}
//             placeholder="Search photos"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {/* <Feather name="search" size={24} color="black" /> */}
//         </View>
//         <FlatList
//           data={filteredPhotoFiles}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//           numColumns={2} // Set the number of columns for the grid
//           columnWrapperStyle={styles.columnWrapper} // Optional styling for columns
//         />
//         {viewingPhoto && (
//           <View {...panResponder.current.panHandlers} style={styles.photoViewerContainer}>
//             <Image
//               source={{ uri: viewingPhoto }}
//               resizeMode="contain"
//               style={styles.photoViewer}
//             />
//           </View>
//         )}
//         {/* <View style={styles.bottomMenu}>
//           <TouchableOpacity style={styles.menuButton}>
//             <MaterialIcons name="photo" size={24} color="black" />
//             <Text>PHOTO</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuButton}>
//             <MaterialIcons name="apps" size={24} color="black" />
//             <Text>APP</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuButton}>
//             <MaterialIcons name="video-library" size={24} color="black" />
//             <Text>VIDEO</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuButton}>
//             <MaterialIcons name="music-note" size={24} color="black" />
//             <Text>AUDIO</Text>
//           </TouchableOpacity>
//         </View> */}
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
//     padding: 15,
//     shadowColor:'green',
//     shadowOffset:{width:0,height:6},
//     shadowOpacity:0.8,
//     shadowRadius:2,
//     borderRadius:40,
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
//     marginEnd:50,
//     borderRadius: 10,
//     padding: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   itemContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     margin: 10,
//   },
//   thumbnailContainer: {
//     width: '100%',
//     height: 100,
//   },
//   thumbnail: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 5,
//     backgroundColor: '#d9d9d9',
//   },
//   details: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   title: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   size: {
//     fontSize: 12,
//     color: '#888',
//   },
//   bottomMenu: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   menuButton: {
//     alignItems: 'center',
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   photoViewerContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   photoViewer: {
//     width: '100%',
//     height: '100%',

//   },
// });

// PhotoScreen.js



import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground, PanResponder } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function PhotoScreen() {
  const [photoFiles, setPhotoFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const panResponder = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
      loadPhotoFiles();
    };
    getPermissions();
  }, []);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setViewingPhoto(null);
      },
    });
  }, []);

  const loadPhotoFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });
    setPhotoFiles(media.assets);
  };

  const handlePhotoPress = (uri) => {
    setViewingPhoto(uri);
  };

  const handleSelectPhoto = (id) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photoFiles.map(photo => photo.id));
    }
    setSelectAll(!selectAll);
  };

  const renderItem = ({ item }) => {
    const fileSizeMB = item.width && item.height ? `${item.width}x${item.height}` : 'Unknown';

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.thumbnailContainer} onPress={() => handlePhotoPress(item.uri)}>
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
        <View style={styles.details}>
          <Text style={styles.title}>{item.filename}</Text>
          <Text style={styles.size}>{fileSizeMB}</Text>
        </View>
        <Checkbox
          value={selectedPhotos.includes(item.id)}
          onValueChange={() => handleSelectPhoto(item.id)}
        />
      </View>
    );
  };

  const filteredPhotoFiles = photoFiles.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      style={styles.backgroundImage}
       //source={require('../../assests/byte.jpg')} 
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assests/logo.png')} style={styles.logo} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search photos"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* <Feather name="search" size={24} color="black" /> */}
        </View>
        <View style={styles.selectAllContainer}>
          <TouchableOpacity style={[styles.selectButton, selectAll && styles.selectButtonActive]} onPress={handleToggleSelectAll}>
            <MaterialIcons name="photo" size={24} color={selectAll ? 'white' : 'black'} />
            <Text style={selectAll ? styles.selectButtonTextActive : styles.selectButtonText}>{photoFiles.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectButton, selectedPhotos.length > 0 && styles.selectButtonActive]}>
            <MaterialIcons name="photo-library" size={24} color={selectedPhotos.length > 0 ? 'white' : 'black'} />
            <Text style={selectedPhotos.length > 0 ? styles.selectButtonTextActive : styles.selectButtonText}>{selectedPhotos.length}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredPhotoFiles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2} // Set the number of columns for the grid
          columnWrapperStyle={styles.columnWrapper} // Optional styling for columns
        />
        {viewingPhoto && (
          <View {...panResponder.current.panHandlers} style={styles.photoViewerContainer}>
            <Image
              source={{ uri: viewingPhoto }}
              resizeMode="contain"
              style={styles.photoViewer}
            />
          </View>
        )}
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
    padding: 15,
    shadowColor:'green',
    shadowOffset:{width:0,height:6},
    shadowOpacity:0.8,
    shadowRadius:2,
    borderRadius:40,
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
    borderBottomColor: '#f0f0f0',
    marginTop:15,
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
    flex: 1,
    flexDirection: 'column',
    margin: 10,
  },
  thumbnailContainer: {
    width: '100%',
    height: 100,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#d9d9d9',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  size: {
    fontSize: 12,
    color: '#888',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  photoViewerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoViewer: {
    width: '100%',
    height: '100%',
  },
});
