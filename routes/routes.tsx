import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { NativeStackHeaderProps, NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack'
import commonScreenProps from './common';
import sutdentScreenProps from './student';
import staffScreenProps from './staff';
import { useTheme } from 'react-native-paper';
import { themeType } from '../theme';
import CustomHeader from '../components/customHeader';
import { navigationRef, storage } from '../App';
import { useDispatch } from 'react-redux';
import { commonActionTypes } from '../redux/common/types';


const Stack = createNativeStackNavigator();



const Routes = () => {
    const theme: themeType= useTheme()
    const screenOptions:NativeStackNavigationOptions ={
        headerShown:false,
        animation:'slide_from_right',
        header: (props)=><CustomHeader {...props} />,
        fullScreenGestureEnabled:true,
        headerStyle : {
            backgroundColor : theme.colors.container_background,
        }
        
    }
    const dispatch = useDispatch();

    useEffect( ()=>{
        if ( storage.contains('user-login')) {
            // @ts-ignore
            // console.log(JSON.parse(storage.getString('user-login')));
      
            // @ts-ignore
            dispatch({type:commonActionTypes.UserLoginDetails , payload : JSON.parse(storage.getString('user-login'))}),
            // @ts-ignore
            navigationRef.navigate("Dashboard");
          }
    }, [])
  return (
    <NavigationContainer ref={navigationRef} theme={{colors:{text: theme.colors.scrim , background:theme.colors.white , card:theme.colors.white }}}>
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Group>
                {commonScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>
            <Stack.Group>
                {sutdentScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>
            <Stack.Group>
                {staffScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;