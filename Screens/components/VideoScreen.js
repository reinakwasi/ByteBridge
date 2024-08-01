import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ImageBackground, PanResponder, Animated } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { getVideoType } from '../../utils';
import { AntDesign } from '@expo/vector-icons';
import ProfileButton from '../../components/ProfileComponent';
import { handleShare } from '../../utils';
import Checkbox from 'expo-checkbox';

export default function VideoScreen() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingUri, setPlayingUri] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const videoRef = useRef(null);
  const [selectAll, setSelectAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [pan] = useState(new Animated.ValueXY());

  const navigation = useNavigation();

  const ShuffleButtonComponent = () => {
    const [showPopUp, setShowPopUp] = useState(false);

    const handleShufflePress = () => {
      setShowPopUp(!showPopUp);
    };

    const handleSendOnPress = () => {
      if (selectedFiles.length === 0){
        navigation.navigate("SendRequestScreen");
      }
      console.log(selectedFiles);
      for (var file of selectedFiles){
        handleShare(file, getVideoType);
      }
      console.log("sending");
    }

    return (
      <View>
        <View style={styles.shuffleButtonContainer}>
          <TouchableOpacity style={styles.shuffleButton} onPress={handleShufflePress}>
            <AntDesign name="swap" size={32} color="white" />
          </TouchableOpacity>
        </View>
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
      loadVideoFiles();
    };
    getPermissions();
  }, []);

  const loadVideoFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({ mediaType: 'video' });
    setVideoFiles(media.assets);
  };

  const handleVideoPress = (uri, index) => {
    if (playingUri === uri) {
      setPlayingUri(null);
      setCurrentIndex(null);
    } else {
      setPlayingUri(uri);
      setCurrentIndex(index);
    }
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
      setSelectedFiles(videoFiles.map(file => file));
    }
    setSelectAll(!selectAll);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onPanResponderMove: Animated.event([
      null, { dx: pan.x }
    ], { useNativeDriver: false }),
    onPanResponderRelease: (evt, gestureState) => {
      const swipeThreshold = 100; // Threshold for swipe distance
      if (gestureState.dx < -swipeThreshold) {
        // Swipe Left
        const nextIndex = (currentIndex + 1) % videoFiles.length;
        setPlayingUri(videoFiles[nextIndex].uri);
        setCurrentIndex(nextIndex);
      } else if (gestureState.dx > swipeThreshold) {
        // Swipe Right
        const prevIndex = (currentIndex - 1 + videoFiles.length) % videoFiles.length;
        setPlayingUri(videoFiles[prevIndex].uri);
        setCurrentIndex(prevIndex);
      }
      pan.flattenOffset();
    },
  });

  const renderItem = ({ item, index }) => {
    const fileSizeMB = item.size ? (item.size / 1048576).toFixed(2) + ' MB' : 'MB';
    const isItemSelected = isSelected(item);

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.thumbnailContainer} onPress={() => handleVideoPress(item.uri, index)}>
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
        <View style={styles.details}>
          <Text style={styles.title}>{item.filename}</Text>
          <Text style={styles.size}>{fileSizeMB}</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={{borderRadius: 50, borderColor:"rgb(211, 211, 211)"}}
            value={selectedFiles.includes(item)}
            onValueChange={() => handleSelectFile(item)}
          />
        </View>
      </View>
    );
  };

  const filteredVideoFiles = videoFiles.filter(file =>
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
            placeholder="Search video"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ProfileButton />
        </View>
        
        <View style={styles.selectAllContainer}>
          <TouchableOpacity style={[styles.selectButton, selectAll && styles.selectButtonActive]} onPress={handleToggleSelectAll}>
            <MaterialIcons name="video-library" size={24} color={selectAll ? 'white' : 'black'} />
            <Text style={selectAll ? styles.selectButtonTextActive : styles.selectButtonText}>{videoFiles.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectButton, selectedFiles.length > 0 && styles.selectButtonActive]}>
            <MaterialIcons name="video-collection" size={24} color={selectedFiles.length > 0 ? 'white' : 'black'} />
            <Text style={selectedFiles.length > 0 ? styles.selectButtonTextActive : styles.selectButtonText}>{selectedFiles.length}</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredVideoFiles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
       
        {playingUri && (
          <View {...panResponder.panHandlers} style={styles.videoPlayerContainer}>
            <Video
              ref={videoRef}
              source={{ uri: playingUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              useNativeControls
              style={styles.videoPlayer}
              onError={(e) => console.log('Video error:', e)}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setPlayingUri(null)}>
              <Feather name="x" size={32} color="white" />
            </TouchableOpacity>
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
    backgroundColor: 'rgb(247, 255, 255)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
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
    backgroundColor: 'white',
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
    flex: 1,
    flexDirection: 'column',
    margin: 10,
  },
  thumbnailContainer: {
    width: '100%',
    height: 100,
    position: 'relative',
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
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  size: {
    fontSize: 12,
    color: '#888',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuButton: {
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  videoPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '50%',
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
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popUpText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  spaceBetweenButtons: {
    width: 30,
    marginEnd: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 10,
  },
});