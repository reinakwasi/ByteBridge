
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground, PanResponder } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { getImageType, handleShare } from '../../utils';
import { AntDesign } from '@expo/vector-icons';
import ProfileButton from '../../components/ProfileComponent';

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
  
  const SendFiles = () => {
    console.log(selectedPhotos)
    for (var file of selectedPhotos){
      const fileType = getImageType(file.filename)
      handleShare(file, fileType)
    }
  }

  const ShuffleButtonComponent = () => {
    const navigation = useNavigation()

    const [showPopUp, setShowPopUp] = useState(false);

    const handleShufflePress = () => {
      setShowPopUp(!showPopUp);
    };

    return (
      <View>
      <View style={styles.shuffleButtonContainer}>
        <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
          <AntDesign name="swap" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {showPopUp && (
        <View style={styles.popUpContainer}>
          <TouchableOpacity style={styles.popUpButton} onPress={() => navigation.navigate("SendRequestScreen")}>
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
          <ProfileButton />
          {/* <Feather name="search" size={24} color="black" /> */}
        </View>
        <View style={styles.selectAllContainer}>
          <TouchableOpacity style={[styles.selectButton, selectAll && styles.selectButtonActive]} onPress={handleToggleSelectAll}>
            <MaterialIcons name="photo" size={24} color={selectAll ? 'white' : 'black'} />
            <Text style={selectAll ? styles.selectButtonTextActive : styles.selectButtonText}>{photoFiles.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={SendFiles} style={[styles.selectButton, selectedPhotos.length > 0 && styles.selectButtonActive]}>
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


  // shuffle buttons
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },

  shuffleButton: {
    backgroundColor: 'rgb(53,189,153)',
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
    backgroundColor: 'rgb(53,189,153)',
    padding: 8,// Navigate to SendRequestScreen
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popUpText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5, // Add some space between icon and text
  },
  spaceBetweenButtons: {
    width: 30,
    marginEnd: 10,
  },



// shufle buttons
  shuffleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },

  shuffleButton: {
    backgroundColor: 'rgb(53,189,153)',
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
    backgroundColor: 'rgb(53,189,153)',
    padding: 8,// Navigate to SendRequestScreen
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popUpText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5, // Add some space between icon and text
  },
  spaceBetweenButtons: {
    width: 30,
    marginEnd: 10,
  },
});
