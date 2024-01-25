import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  BackHandler,
  StatusBar,
  Easing,
  useWindowDimensions,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import IosSafeArea from '../../../components/iosSafeArea';
import {
  Avatar,
  Button,
  IconButton,
  useTheme,
  Text,
  Portal,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {themeType} from '../../../theme';
import Animated, {blue, useReducedMotion} from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';
import {MapStateToProps, connect, useDispatch, useSelector, useStore} from 'react-redux';
import MenuBottomSheet from './MenuBottomSheet';
import {StaffDashOptions, StudentDashOptions} from './DashOptions';
import {useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import CMScard from '../../../components/cms_card';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import StudentViewAttendence from './StudentViewAttendence';
import {storage} from '../../../App';
import {Dialog} from 'react-native-paper';
import RNExitApp from 'react-native-exit-app';
import {userType} from '../../../constants';
import StudentProfile from './StudentProfile';
import { useQuery } from 'react-query';
import { commonApi } from '../../../api/API';
import { commonActionTypes } from '../../../redux/common/types';
import { useBackHandler } from '@react-native-community/hooks';
import { RootState } from '../../../redux/store';

const Dashboard = () => {
  const theme: themeType = useTheme();
  const window = useWindowDimensions();
  const styles = StyleSheet.create({
    dashboardContainer: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
    },
    topButtons: {
      flexDirection: 'row',
      padding: 5,
    },
    IconButton: {
      borderRadius: 20,
    },
    SheetViewStyle: {
      backgroundColor: theme.colors.white,
      borderRadius: 35,
      padding: 20,
    },

    progressStyle: {
      flexDirection: 'column',
      flex: 1,
      minWidth: 60,
      alignContent: 'center',
      alignItems: 'center',
      alignSelf : "baseline",
    },
    academicCalendar: {
      width: window.width - 20,
      minWidth: 200,
      maxWidth: 600,
      borderRadius: 35,
      padding: 15,
      backgroundColor: theme.colors.cms_card_background,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      alignSelf : "center"
    },
    previewProfileScrollView: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      width: window.width,
      maxWidth: 500,
      alignSelf: 'center',
      gap: 20,
    },
    profileContainer: {
      marginHorizontal: 30,
      paddingVertical: 20,
      gap: 20,
    },
    headingsFont : {
      paddingHorizontal: 20,
      lineHeight: 30 ,
      fontSize: 14,
      fontWeight: 700,
      color: theme.colors.black,
    },
    nameHeadingsFont:{
      fontSize : 22,
      fontWeight:'700'
    }
  });

  const snapPoints = useMemo(
    () => [window.height - 200, window.height - 60],
    [window.height],
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSVRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);

  // @ts-ignore
  const user = useSelector((store:RootState) => store.common.User.user);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (user.type == userType.student) setDashOptions(StudentDashOptions);
    else setDashOptions(StaffDashOptions);
    console.log('dashboard : ', user);
  }, [user]);

  const [DashOptions, setDashOptions] = useState([]);

  const navigator = useNavigation();
  const [newNotification, setNewNotification] = useState(0);

  useEffect(() => {
    // Permission for android 13+
    // PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');

    // Check for unseen notification
    const change_dimension  = Dimensions.addEventListener('change' , ({window})=>{
      setProfile(false);
    })


    const notifications = storage.getString('notifications');
    let count = 0;
    if (notifications !== undefined) {
      let notificationArray = JSON.parse(notifications);
      notificationArray.map(item => {
        if (!item.seen) count++;
      });
      setNewNotification(count);
    }

    return ()=>change_dimension.remove();

  }, []);

  
  useBackHandler(()=>{
    console.log("back from dashborad")
    setExitDialogVisible(true);
    return true;
  })

  const [exitDialogVisible, setExitDialogVisible] = useState(false);


  useEffect(() => {
    profile
      ? bottomSheetRef.current?.snapToPosition(230)
      : bottomSheetRef.current?.snapToIndex(0);
    window.height < 700 && profile
      ? bottomSheetRef.current?.close()
      : bottomSheetRef.current?.snapToIndex(0);

    if ( !profile ) profileSVRef.current?.scrollTo({
      y : 0,
      animated : true,
    })
  }, [profile, bottomSheetRef]);

  const dispatch = useDispatch();

  const academicSession = useQuery( commonApi.academicSession.name , ()=>commonApi.academicSession.fetch() ,{
    onSuccess : (data)=>{
      dispatch({
        type: commonActionTypes.AcademicSession,
        payload: {
          sessions: [...data],
          current:  data.find(item => item.active),
        },
      });
    }
  } )
  

  return (
    // <IosSafeArea
    //   color={theme.colors.container_background}
    //   barStyle="dark-content">
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <ExitDialog
            exitDialogVisible={exitDialogVisible}
            setExitDialogVisible={setExitDialogVisible}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.container_background,
              justifyContent: 'flex-start',
            }}>
            <View style={styles.topButtons}>
              <IconButton
                style={styles.IconButton}
                rippleColor={theme.colors.backdrop}
                onPress={() => setMenuOpen(!menuOpen)}
                icon="menu"
                iconColor={menuOpen ? theme.colors.primary : theme.colors.black}
                size={theme.icon.button_size}
                containerColor={menuOpen ? theme.colors.white : undefined}
              />
              <View style={{flex: 1, height: 50}}></View>
              <IconButton
                // @ts-ignore
                onPress={() => navigator.push('Notification')}
                style={styles.IconButton}
                icon="bell"
                iconColor={theme.colors.black}
                rippleColor={theme.colors.backdrop}
                size={theme.icon.button_size}
              />
              <IconButton
                onPress={() => setProfile(!profile)}
                style={styles.IconButton}
                icon={'user'}
                iconColor={profile ? theme.colors.primary : theme.colors.black}
                rippleColor={theme.colors.backdrop}
                size={theme.icon.button_size}
                containerColor={profile ? theme.colors.white : undefined}
              />
            </View>
            <View>
              <ScrollView
                style={{marginBottom: window.height < 700 ? 0 : 300}}
                ref={profileSVRef}
                contentContainerStyle={styles.previewProfileScrollView}
                scrollEnabled={profile}>
                <View style={styles.profileHeader}>
                  <Avatar.Image
                    size={window.width < 500 ?window.width/4 : 110}
                    source={user?.photograph?{
                      uri : user?.photograph
                    }: require("../../../assets/images/avatar.png")}
                  />
                  <View style={{flexWrap: 'wrap'}}>
                    <Text
                      variant="bodyLarge"
                      numberOfLines={2}
                      style={styles.nameHeadingsFont}>
                      Hey,{'\n'}
                      {user?.name || ''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      selectable
                      selectionColor={theme.colors.yellow}
                      style={{
                        fontSize: 15,
                        color: theme.colors.scrim,
                        flexWrap: 'wrap',
                      }}>
                      {user?.department || ''} • {user?.enrollment || ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.profileContainer}>
                  <Text variant="headlineMedium" style={{textAlign: 'center'}}>
                    <Icon name="user" size={30} />
                    Profile
                  </Text>
                  <StudentProfile user = {user}  profile={profile}/>
                </View>
              </ScrollView>
            </View>
          </View>
          <BottomSheet
            animateOnMount={!reducedMotion}
            ref={bottomSheetRef}
            snapPoints={profile ? [230] : snapPoints}
            index={0}
            handleIndicatorStyle={{backgroundColor: theme.colors.primary}}
            backgroundStyle={styles.SheetViewStyle}>
            <BottomSheetScrollView contentContainerStyle={{gap : 10 }}>
              <View>
                <Text
                  numberOfLines={1}
                  // @ts-ignore
                  style={styles.headingsFont}>
                  RECENTLY USED
                </Text>
                <CMScard>
                  {DashOptions.map((item, index) => (
                    <View key={index} style={styles.progressStyle}>
                      <Button
                        // @ts-ignore
                        onPress={() => navigator.navigate(item.to)}
                        style={styles.IconButton}
                        rippleColor={theme.colors.backdrop}
                      >
                        <Icon
                          name={item.icon}
                          size={theme.icon.button_size}
                          color={theme.colors.black}
                          style={{height: 50, width: 30 ,padding: 0 , alignSelf:"center",}}
                        />
                      </Button>
                      <Text
                        numberOfLines={2}
                        style={{color: theme.colors.scrim, textAlign: 'center'}}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </CMScard> 
              </View>
              <View>
              <Text
                style={styles.headingsFont}>
                ATTENDANCE
              </Text>
                <StudentViewAttendence />
              </View>
              
              <View>
                <Text
                  numberOfLines={1}
                  // @ts-ignore
                  style={styles.headingsFont}>
                  ACADEMIC CALENDAR
                </Text>
                <CMScard style={{padding: 0}}>
                  <Calendar
                    enableSwipeMonths
                    hideExtraDays
                    // displayLoadingIndicator
                    style={styles.academicCalendar}
                    markingType={'custom'}
                    markedDates={{
                      '2023-08-03': {
                        customStyles: {
                          container: {
                            backgroundColor: 'red',
                            borderRadius: 20,
                          },
                          text: {
                            color: 'white',
                            fontWeight: 'bold',
                          },
                        },
                      },
                      '2023-08-05': {
                        customStyles: {
                          container: {
                            backgroundColor: theme.colors.container_background,
                            borderRadius: 20,
                          },
                          text: {
                            color: theme.colors.primary,
                            fontWeight: 'bold',
                          },
                        },
                      },
                    }}
                  />
                </CMScard>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
          <MenuBottomSheet open={menuOpen} changeOpen={setMenuOpen} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    // </IosSafeArea>
  );
};

const ExitDialog = props => {
  return (
    <Portal>
      <Dialog
        visible={props.exitDialogVisible}
        onDismiss={() => props.setExitDialogVisible(false)}>
        <Dialog.Title>Exit App </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Do you really want to exit?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => props.setExitDialogVisible(false)}>
            Cancel
          </Button>
          <Button onPress={() => RNExitApp.exitApp()}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Dashboard;
