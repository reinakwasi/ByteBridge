import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Video } from 'expo-av';
import WelcomeButton from '../../components/WelcomeButton';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Video Background */}
            <Video
                source={{ uri: 'https://videos.pexels.com/video-files/5680034/5680034-hd_1280_720_24fps.mp4' }} // Replace with your video URL
                style={styles.backgroundVideo}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
            />

            {/* Content */}
            <View style={styles.overlay}>
                <Text style={styles.title}>Welcome to Our Website</Text>
                <Pressable style={styles.button} onPress={() => navigation.navigate("MainTapNavigator")}>
                <WelcomeButton message="Get Started"/>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundVideo: {
        ...StyleSheet.absoluteFillObject,
        width,
        height,
        zIndex: -1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Adds a dark overlay to make text readable
        padding: 20,
    },
    title: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop:300,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default WelcomeScreen;
