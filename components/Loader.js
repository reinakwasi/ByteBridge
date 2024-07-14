import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import React from 'react'

const Loader = (props) => {
    const { message } = props
  return (
    <View style={{alignItems: "center"}}>
    <LottieView
      style={styles.lottieIndicator}
      source={require('../assests/bytebridgeLoading.json')}
      autoPlay
      loop
      speed={2.2}
    />
    <Text style={styles.msg}>{`${message}...`}</Text>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
  msg: {
        fontSize: 30,
    },


  lottieIndicator: {
    // fontFamily:',
    width: 250,
    height: 500
  }
})