import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Platform } from 'react-native'
import { FileSystem, shareAsync } from 'expo';


const ReceiveLoader = (props) => {
    const { message } = props
  return (
    <View style={{alignItems: "center"}}>
    <LottieView
      style={styles.lottieIndicator}
      source={require('../assets/bytebridgeLoading.json')}
      autoPlay
      loop
      speed={2}
    />
    <Text style={styles.msg}>{`${message}...`}</Text>
    </View>
  )
}

export default  ReceiveLoader


const styles = StyleSheet.create({
  msg: {
        fontSize: 30,
    },


  lottieIndicator: {
    // fontFamily:',
    width: 400,
    height: 500
  }
})