import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, ActivityIndicator, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground, PanResponder, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { handleShare } from '../../utils';
import { getImageType } from '../../utils';
import { BlurView } from 'expo-blur';
import ProfileButton from '../../components/ProfileComponent';
//import Checkbox from '@react-native-community/checkbox';
import Checkbox from 'expo-checkbox';



export default function PhotoScreen() {
  const [photoFiles, setPhotoFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false)
  const panResponder = useRef(null);
  const [filename, setFilename] = useState("")

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

  const handleSelectPhoto = (item) => {
    if (isSelected(item)) {
      setSelectedPhotos(selectedPhotos.filter(photo => photo.id !== item.id));
    } else {
      setSelectedPhotos([...selectedPhotos, item]);
    }
  };

  const isSelected = (item) => {
    return selectedPhotos.some(photo => photo.id === item.id);
  };

  const ShuffleButtonComponent = () => {
    const navigation = useNavigation()
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
        handleShare(file, getImageType)
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
    }

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
    )
  }

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
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={selectedPhotos.includes(item)}
            style = {{borderRadius: 50, borderColor:"rgb(211, 211, 211)"}}
            onValueChange={() => handleSelectPhoto(item)}
          />
        </View>
      </View>
    );
  };

  const filteredPhotoFiles = photoFiles.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search photos"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ProfileButton />
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
      <ShuffleButtonComponent />


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
    padding: 15,
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 40,
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
    borderBottomColor: '#fffff',
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
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    position: 'relative', // For positioning the radio button within the thumbnail
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

  checkboxContainer:{
    position: 'absolute',
    top: 5,
    right: 5,
  },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: 'rgb(53, 189, 153)',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(53, 189, 153)',
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
