// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
// import * as DocumentPicker from 'expo-document-picker';
// import Checkbox from 'expo-checkbox';
// import { Feather, MaterialIcons } from '@expo/vector-icons';

// export default function DocumentScreen() {
//   const [documentFiles, setDocumentFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   useEffect(() => {
//     const getPermissions = async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access media library is required!');
//         return;
//       }
//       loadDocumentFiles();
//     };
//     getPermissions();
//   }, []);

//   const loadDocumentFiles = async () => {
//     const media = await MediaLibrary.getAssetsAsync({
//       mediaType: 'unknown',
//       first: 1000,
//     });

//     const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
//     const documents = media.assets.filter(file =>
//       documentExtensions.some(ext => file.filename.toLowerCase().endsWith(`.${ext}`))
//     );

//     setDocumentFiles(documents);
//   };

//   const handleSelectFile = (id) => {
//     if (selectedFiles.includes(id)) {
//       setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
//     } else {
//       setSelectedFiles([...selectedFiles, id]);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <TouchableOpacity style={styles.details} onPress={() => { /* Handle document opening */ }}>
//         <Text style={styles.title}>{item.filename || item.name}</Text>
//       </TouchableOpacity>
//       <Checkbox
//         value={selectedFiles.includes(item.id)}
//         onValueChange={() => handleSelectFile(item.id)}
//       />
//     </View>
//   );

//   const filteredDocumentFiles = documentFiles.filter(file =>
//     file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     file.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <ImageBackground
//       // source={require('./assets/byte.jpg')} // Replace with your background image
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Image source={require('../assests/logo.png')} style={styles.logo} />
//           <TextInput
//             style={styles.searchBar}
//             placeholder="Search documents"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           <Feather name="search" size={24} color="black" />
//         </View>
//         <FlatList
//           data={filteredDocumentFiles}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}
//         />
//         {/* Remove the footer menu for documents */}
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
//     marginTop: 25,
//     padding: 10,
//     backgroundColor: 'transparent', // Make header transparent to see background image
//     elevation: 2,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//   },
//   searchBar: {
//     flex: 1,
//     marginHorizontal: 10,
//     borderRadius: 5,
//     padding: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   details: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';

// export default function DocumentScreen() {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const { type, uri, name, size } = await DocumentPicker.getDocumentAsync();
//       if (type === 'success') {
//         setDocuments([{ uri, name, size }]);
//       }
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   };

//   const renderItem = ({ item }) => {
//     return (
//       <TouchableOpacity onPress={() => openDocument(item)}>
//         <View style={styles.documentItem}>
//           <Text>{item.name}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const openDocument = async (document) => {
//     try {
//       await DocumentPicker.viewDocumentAsync(document);
//     } catch (error) {
//       console.error('Error opening document:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={documents}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 10,
//   },
//   documentItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });




import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import Checkbox from 'expo-checkbox';
import { Feather } from '@expo/vector-icons';

export default function DocumentScreen() {
  const [documentFiles, setDocumentFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
      loadDocumentFiles();
    };
    getPermissions();
  }, []);

  const loadDocumentFiles = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'unknown',
        first: 1000,
      });

      const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
      const documentsFromMedia = media.assets.filter(file =>
        documentExtensions.some(ext => file.filename.toLowerCase().endsWith(`.${ext}`))
      );

      // Fetch documents using DocumentPicker
      const documentPickerResult = await DocumentPicker.getDocumentAsync();

      if (documentPickerResult.type === 'success') {
        const { uri, name, size } = documentPickerResult;
        const newDocument = { uri, name, size };
        setDocumentFiles([...documentsFromMedia, newDocument]);
      } else {
        setDocumentFiles(documentsFromMedia);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleSelectFile = (id) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
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

  const openDocument = async (document) => {
    try {
      if (document.uri) {
        await DocumentPicker.viewDocumentAsync(document);
      } else {
        // Handle opening from MediaLibrary if needed
        // Example: await MediaLibrary.getAssetInfoAsync(document.id);
      }
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const filteredDocumentFiles = documentFiles.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      // source={require('./assets/byte.jpg')} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search documents"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={24} color="black" />
        </View>
        <FlatList
          data={filteredDocumentFiles}
          renderItem={renderItem}
          keyExtractor={item => item.id || item.uri}
        />
        {/* Remove the footer menu for documents */}
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
});
