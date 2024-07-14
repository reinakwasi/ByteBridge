import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { WEBSOCKET_URL } from '../env';


const SendRequestScreen = () => {
    const [qrValue, setQRValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    
    function generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    let share_channel_id = generateRandomString(10) 
    const SHARE_SERVER_URL = `${WEBSOCKET_URL}/ws/socket-server/${share_channel_id}/`

    const generateQRCode = () => {
        setQRValue(SHARE_SERVER_URL); 

        if (!SHARE_SERVER_URL) { 
            setIsActive(false); 
        } 
        
        const ws = new WebSocket(SHARE_SERVER_URL);

        ws.onopen = () => {
        console.log('WebSocket connection opened');
        // setMessage("Waiting to receive files");
        };

        ws.onerror = (e) => {
            Alert.alert(e.message);
        };

        setIsActive(true);
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    Scan to connect
                </Text>
                {isActive && (
                    <View style={styles.qrCode}>
                        <QRCode
                            value={qrValue}
                            size={200}
                            color="black"
                            backgroundColor="white"
                        />
                    </View>
                )}
                <TouchableOpacity
                style={styles.button}
                onPress={generateQRCode}
                >
                <Text style={styles.buttonText}>
                    Regenerate QR Code
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default SendRequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    wrapper: {
        maxWidth: 300,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
    },
    title: {
        fontSize: 21,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: "center"
    },

    button: {
        backgroundColor: 'rgb(53,189,153)',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    qrCode: {
        marginBottom: 20,
        alignItems: 'center',
    },
})
