import axios from "axios"
import { BACKEND_URL } from "../ENV/Global"
// import {AsyncStorage} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
// impo
// import {sendMessageTo, sendFileTo } from 'react-native-transfer-big-files';
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const storage = useAsyncStorage()

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
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: fileType(file.filename),
        name: file.filename,
      });
  
      const response = await axios.post(shareEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload successful:', response.data);
      // Handle success, navigate, or update state as needed
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error, show error message, etc.
    }
  };


export const getImageType = (filename) => {
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



