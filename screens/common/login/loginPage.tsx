
import { FC, useEffect, useState } from "react";
import { BackHandler, Dimensions, ImageBackground, KeyboardAvoidingView, StatusBar, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import StaffLogin from "./staffLogin";
import StudentLogin from "./studentLogin";
import { ScrollView } from "react-native";
import theme, { themeType } from "../../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView , SceneMap } from "react-native-tab-view";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import IosSafeArea from "../../../components/iosSafeArea";
import { storage } from "../../../App";
import { useDispatch } from "react-redux";
import { commonActionTypes } from "../../../redux/common/types";
import { useNavigation } from "@react-navigation/native";


const Tab = createMaterialTopTabNavigator();


const LoginPage:FC = () =>{
    
    const theme:themeType = useTheme();

    const navigation = useNavigation();

    const dispatch = useDispatch();
  
    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp()
      return true;
    });

    

return (
  <IosSafeArea>
    <StatusBar backgroundColor={theme.colors.primaryContainer} barStyle={"dark-content"}/>
  <ImageBackground
    source={require('../../../assets/images/IPS-3417.png')}
    style={{flex: 1}}
    resizeMode="cover">
    <Tab.Navigator
      id="loginTab"
      sceneContainerStyle={style.sceneContainer}
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: theme.colors.primary},
        tabBarStyle: {backgroundColor: theme.colors.primaryContainer},
        tabBarLabelStyle: {
          color: theme.colors.primary,
          fontWeight: 'bold',
          fontSize: 17,
        },
      }}>
      <Tab.Screen name="Student" component={StudentLogin} />
      <Tab.Screen name="Staff" component={StaffLogin} />
    </Tab.Navigator>
  </ImageBackground>
  </IosSafeArea>
);

}

const {height} = Dimensions.get("screen")
  
  const style = StyleSheet.create({

    sceneContainer : {
      backgroundColor:"transparent",
      backfaceVisibility:"hidden",
    }
   
  });

  export default LoginPage;