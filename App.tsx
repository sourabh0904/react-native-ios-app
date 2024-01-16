/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Dimensions,
  LogBox,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Touchable,
  useColorScheme,
  View,
} from 'react-native';

import { useNetInfo } from "@react-native-community/netinfo"
import customTheme, { fontConfig } from './theme';
import {NavigationContainer, createNavigationContainerRef, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/common/login/loginPage';
import {createAppContainer} from 'react-navigation';
import LottieView from 'lottie-react-native';
import {useOrientation} from 'react-native-ui-lib/src/hooks';
import {PaperProvider, Snackbar, TouchableRipple, configureFonts} from 'react-native-paper';
import {MD3DarkTheme, Text ,  MD3LightTheme} from 'react-native-paper';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useDispatch} from 'react-redux';
import store from './redux/store';
import Routes from './routes/routes';
import Icon from 'react-native-vector-icons/Feather';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MMKV} from 'react-native-mmkv';
import { dispatchCommand } from 'react-native-reanimated';
import { commonActionTypes } from './redux/common/types';
import { ToastConfig , ToastConfigParams } from 'react-native-toast-message'
import Toast from 'react-native-toast-message'

export const storage = new MMKV();
type SectionProps = PropsWithChildren<{
  title: string;
}>;

export const navigationRef = createNavigationContainerRef();

type orientationProp = {
  window: {
    width: number;
    height: number;
  };
};

const Stack = createNativeStackNavigator();
const query_client = new QueryClient();

function App(): JSX.Element {


  LogBox.ignoreLogs(['Warrning: ...']);
  LogBox.ignoreAllLogs();
  const isDarkMode = useColorScheme() === 'dark';
  const [splash, setSplash] = useState(true);
  const orientation = useOrientation();
  const dark = useColorScheme() == 'dark';
  const {theme} = useMaterial3Theme({sourceColor: '#002877'});

  const applyTheme = dark
    ? {
        ...MD3DarkTheme,
        // colors : customTheme,
        // colors : customTheme.colors,
        ...customTheme,
        colors: {...theme.light, ...customTheme.colors},
        font: configureFonts({config : fontConfig})
        
      }
    : {
        ...MD3LightTheme,
        // colors : customTheme,
        // colors : customTheme.colors,
        ...customTheme,
        colors: {...theme.light, ...customTheme.colors},
        font: configureFonts({config : fontConfig})
      };



  const linking = {
    prefixes: ['http://cms.ipsacademy.net/', 'ips://'],
  };


  // useEffect(() => {

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     if (storage.contains('notifications')) {
  //       const previous = storage.getString('notifications');
  //       if (previous !== undefined) {
  //         const data = [  ...JSON.parse(previous),{...remoteMessage.notification , seen:false} ];
  //         storage.set('notifications', JSON.stringify(data));
  //       } else {
  //         storage.set(
  //           'notifications',
  //           JSON.stringify([{...remoteMessage.notification , seen:false}]),
  //         );
  //       }
  //     } else {
  //       storage.set(
  //         'notifications',
  //         JSON.stringify([{...remoteMessage.notification , seen:false}]),
  //       );
  //     }
  //     let notifications = storage.getString("notifications");
  //     if ( notifications !== undefined){
  //       let notificationArray = JSON.parse(notifications);
  //       store.dispatch({type:commonActionTypes.ClearNotification});
  //       notificationArray.map(item=>{
  //         store.dispatch({type:commonActionTypes.GetNotification , payload : item})
  //       })
  //     }

      

  //     Toast.show({
  //       type : "info",
  //       text1 : remoteMessage.notification?.title,
  //       text2 : remoteMessage.notification?.body,
  //       visibilityTime : 6000,
  //       topOffset : 55 ,
  //       props : {
  //         icon : "bell"
  //       },
  //       onPress : ()=>{
  //         Toast.hide();
  //         // @ts-ignore
  //         if (navigationRef.isReady()) navigationRef.navigate("Notification")
  //       }
  //     })
  //   });
  //   requestUserPermission();
  //   notificationListener();
  //   return unsubscribe;
  // }, []);



  // toaster setting up
  const toastStyles = StyleSheet.create({
    toastContainer :{
      flex:1,
      flexDirection : "row",
      alignItems : "center",
      padding:10,
      gap: 10 ,
      maxWidth : 500,
      borderRadius : 20 ,
      borderLeftWidth : 5,
      marginHorizontal : 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 10,
    },
    toastDescription:{
      // paddingHorizontal: 10 ,
  
    },
    success : {
      borderLeftColor : applyTheme.colors.green,
      backgroundColor : applyTheme.colors.white,
    },
    error : {
      borderLeftColor : applyTheme.colors.red,
      backgroundColor : applyTheme.colors.white,
    },
    info : {
      borderLeftColor : applyTheme.colors.primary,
      backgroundColor : applyTheme.colors.white,
    },
    warning : {
      borderLeftColor : applyTheme.colors.yellow,
      backgroundColor : applyTheme.colors.white,
    },
  })
  
  
  const toastConfig:ToastConfig = {
    success : (props:ToastConfigParams<any>)=>(
      <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
      <View style={[toastStyles.toastContainer , toastStyles.success]}>
        <Icon name={props.props.icon || "check-circle"} size={25} color={applyTheme.colors.green} />
        <View style={{flex:1 , gap:5}}>
          <Text variant="titleMedium" style={{color:applyTheme.colors.green}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
          <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
        </View>
      </View>
      </Pressable>
    ),
    error : (props:ToastConfigParams<any>)=>(
      <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
      <View style={[toastStyles.toastContainer , toastStyles.error]}>
        <Icon name={props.props.icon || "x-circle"} size={25} color={applyTheme.colors.error} />
        <View style={{flex:1 , gap:5}}>
          <Text variant="titleMedium" style={{color:applyTheme.colors.error}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
          <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
        </View>
      </View>
      </Pressable>
    ),
    info : (props:ToastConfigParams<any>)=>(
      <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
      <View style={[toastStyles.toastContainer , toastStyles.info]}>
        <Icon name={props.props.icon || "alert-circle"} size={25} color={applyTheme.colors.primary} />
        <View style={{flex:1 , gap:5}}>
          <Text variant="titleMedium" style={{color:applyTheme.colors.primary}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
          <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
        </View>
      </View>
      </Pressable>
    ),
    warning : (props:ToastConfigParams<any>)=>(
      <Pressable style={{flex:1 ,flexDirection:"row"}} onPress={props.onPress} >
      <View style={[toastStyles.toastContainer , toastStyles.warning]}>
        <Icon name={props.props.icon || "alert-triangle"} size={25} color={applyTheme.colors.yellow} />
        <View style={{flex:1 , gap:5}}>
          <Text variant="titleMedium" style={{color:applyTheme.colors.yellow}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
          <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
        </View>
      </View>
      </Pressable>
    ),
  }
  
  const [bar_color , set_bar_color] = useState({color:applyTheme.colors.white , style:"dark-content"});

  setTimeout(  ()=>set_bar_color({color:"#002877" , style : "light-content"}) ,  1150)


  if( splash) return (
    <>
    <StatusBar barStyle={bar_color.style} animated backgroundColor={bar_color.color} />
    <LottieView
          source={require('./assets/splash/IPS_splash_improved.json')}
          style={{
            height: Dimensions.get('window').height,
            backgroundColor: bar_color.color,
          }}
          autoPlay
          resizeMode={
            orientation.orientation == 'landscape' ? 'center' : 'cover'
          }
          loop={false}
          onAnimationFinish={() => {
            setSplash(false);
          }}
        />
        </>
  )



  return (
        <QueryClientProvider client = {query_client}>
        <Provider store={store}>
          <SafeAreaProvider style={{flex : 1 , backgroundColor:applyTheme.colors.container_background }}>
            <PaperProvider
              settings={{icon: props => <Icon {...props} suppressHighlighting={true} />}}
              theme={applyTheme}>
              <Routes />
              <Toast config={toastConfig}  />
            </PaperProvider>
          </SafeAreaProvider>
        </Provider>
        </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
