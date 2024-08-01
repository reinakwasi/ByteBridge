import axios from "axios"
import { BACKEND_URL } from "./env";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getItem = async (key) => {
  console.log(key)
  try {
    const value = await AsyncStorage.getItem(key);
    console.log("value", value)
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};



export const pushToCloud = async (file) => {
    try {
    console.log(file)
    let formData = new FormData()

    formData.append('name', file.filename); // Example field
    formData.append('image', {
      uri: file.uri,
      type: 'image/jpeg', // Change accordingly, could be image/png etc.
      name: file.filename, // Your desired file name
    });
  
    const response = await axios.post(`${BACKEND_URL}/cloud/upload-file/`, formData, {
        headers : {
            'Authorization': `Bearer jsjs`,
            'Content-Type': 'multipart/form-data',
        }
    })
    console.log(response.status)
    return response.data;
    }
    catch (err) {
        console.log(err)
    }
    // return statusCode;
}


export const saveToken = async (token) => {
    try {
        await storage.setItem('token', token);
      } catch (error) {
        console.error('Error saving token:', error);
    }
}


export const handleShare = async (file, fileType) => {
    console.log(file)
    const shareEndpoint = `${BACKEND_URL}/share/share-file/`;
    const share_channel_id = await getItem("share_channel_id")
    console.log("hasj", share_channel_id)
    
    try {
      const formData = new FormData ();
      formData.append('file', {
        uri: file.uri,
        type: fileType(file.filename),
        name: file.filename,
      });
      formData.append('share_channel_id', share_channel_id)
  
      const response = await axios.post(shareEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload successful:', response.data);
      // return response.data
      // Handle success, navigate, or update state as needed
    } catch (error) {
      console.error('Error uploading image:', error);
      // return "File sharing failed"
      // Handle error, show error message, etc.
    }
  };


export function getImageType(filename){
    const extension = filename.split('.').pop().toLowerCase();

    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
    };

    return mimeTypes[extension] || 'image/jpeg'; 
  };

export const getAudioType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',
    };
    return mimeTypes[extension] || 'audio/mpeg';
  };

export  const getVideoType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    const mimeTypes = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
    };
    return mimeTypes[extension] || 'video/mp4'; 
  };



