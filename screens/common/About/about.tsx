import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';

const About = () => {

  const navigator = useNavigation();

  useBackHandler(()=>{
    navigator.goBack();
    return true;
  })

  return (
    <View>
      <Text>About</Text>
    </View>
  )
}

export default About

const styles = StyleSheet.create({})