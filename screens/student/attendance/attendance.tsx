import { Animated, BackHandler, Dimensions, FlatList, ScrollView, StyleSheet,  View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, IconButton, List, TouchableRipple, useTheme ,Text} from 'react-native-paper';
import IosSafeArea from '../../../components/iosSafeArea';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { studentActionTypes } from '../../../redux/student/types';
import { themeType } from '../../../theme';
import CustomHeader from '../../../components/customHeader';
import Icon from 'react-native-vector-icons/Feather';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useWindowDimensions } from 'react-native';
import ItemList from './ItemList';
import NoData from '../../../components/noData';
import { RefreshControl } from 'react-native';
import CustomLoading from '../../../components/customLoading';
import { useBackHandler } from '@react-native-community/hooks';

const Attendance = () => {
    const theme:themeType = useTheme();
    // @ts-ignore
    const user = useSelector(store=>store.common.User.user);
    // @ts-ignore
    const attendance = useSelector(store=>store.student.Attendance);
    const dispatch = useDispatch();

    const current_session = useSelector(store=>store.common.AcademicSession?.current.academic_session_id)


    const {isFetching , refetch} = useQuery(studentApi.studentAttendance.name , ()=>studentApi.studentAttendance.fetch({academic_session:current_session, computer_code:user.computer_code}),
    {
      onSuccess:(data)=>{
        dispatch({type:studentActionTypes.Attendance , payload : data})
      }
    });
    

    const navigator = useNavigation();

    useBackHandler(()=>{
      navigator.goBack();
      return true;
    })

    const window = useWindowDimensions();

    const [refresh , setRefresh] = useState(false)

    function refetchData(){
      setRefresh(true);
      refetch().then((value)=>{
        // console.log(value);
        setRefresh(false);
      })
    }

    if(isFetching) return(
      <CustomLoading />
    )

  return (
    <>
        <FlatList
          data={attendance}
          contentContainerStyle={{paddingTop: 50, paddingBottom: 20, gap: 10 , minHeight: window.height-100}}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => <ItemList item={item} />}
          refreshControl={(
            <RefreshControl progressViewOffset={50} progressBackgroundColor={theme.colors.container_background} refreshing={refresh} onRefresh={refetchData}/>
          )}
          ListEmptyComponent={<NoData text="No Records" />}
        />
    </>
  );
}

export default Attendance
