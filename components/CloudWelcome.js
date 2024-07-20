import { View, StyleSheet, Text } from 'react-native'
import LottieView from 'lottie-react-native'

const CloudWelcome = (props) => {
    const { message } = props
    return (
      <View style={{alignItems: "center"}}>
      <LottieView
        style={styles.lottieIndicator}
        source={require('../assets/cloudLoading.json')}
        autoPlay
        loop
        speed={2}
      />
      </View>
    )
  }
  
  export default CloudWelcome
  
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