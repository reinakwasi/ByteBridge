import { View, StyleSheet, Text } from 'react-native'
import LottieView from 'lottie-react-native'

const GeneralLoader = (props) => {
    const { message } = props
    return (
      <View style={{alignItems: "center"}}>
      <LottieView
        style={styles.lottieIndicator}
        source={require('../assets/loader.json')}
        autoPlay
        loop
        speed={2}
      />
      <Text style={styles.msg}>{`${message}...`}</Text>
      </View>
    )
  }
  
  export default GeneralLoader
  
  const styles = StyleSheet.create({
    msg: {
          fontSize: 30,
      },
  
  
    lottieIndicator: {
      // fontFamily:',
      width: 400,
      height: 400
    }
  })