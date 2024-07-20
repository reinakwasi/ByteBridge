import { StyleSheet, Text, View, Pressable, Button } from 'react-native'
import React from 'react'

const WelcomeButton = (props) => {
    const { onPress } = props
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Start Your Cloud Storage</Text>
    </Pressable>
  )
}

export default WelcomeButton

const styles = StyleSheet.create({
    button:{
        backgroundColor:"#004d40",
        width:300,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        elevation: 12,
    },

    text: {
        color:"white",
        fontSize:20,
    }
})