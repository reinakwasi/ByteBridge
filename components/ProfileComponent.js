import { StyleSheet, Text, Image ,Pressable} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
// import { Icon } from '@rneui/themed'
// import Icon from 'react-native-elements'
// import { Icon } from 'react-native-vector-icons/Icon'


const ProfileButton = () => {
  let [ username, setUsername ] = useState("Profile")
  const navigation = useNavigation()
  return (
    <Pressable onPress={() => navigation.navigate("CloudScreen")}>
       <Image
        style={styles.Image}
        source={require('../assets/profile.png')}
      />
    {/* <Text className="text-slate-900">{username}</Text> */}
  </Pressable>
  )
}

export default ProfileButton

const styles = StyleSheet.create({
  ProfileStyle: {
    // backgroundColor: '#a8a7af',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Image : {
    width: 50,
    height: 50,
    margin: 2,
    borderRadius: 20
  }
})


