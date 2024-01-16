import { BackHandler, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { useDispatch, useSelector } from 'react-redux';
import { studentActionTypes } from '../../../redux/student/types';
import {List, Text, useTheme } from 'react-native-paper';
import NoData from '../../../components/noData';
import CustomLoading from '../../../components/customLoading';
import { RefreshControl } from 'react-native';
import { themeType } from '../../../theme';
import Icon from "react-native-vector-icons/Feather";
import CustomError from '../../../components/customError';
import { useBackHandler } from '@react-native-community/hooks'


const NbaFeedbackStatus = () => {
  
    const window = useWindowDimensions();
    const styles = StyleSheet.create({
      fListContainer: {
        paddingTop: 50,
        paddingBottom: 20,
        gap: 10,
        minHeight: window.height - 100,
      },
    });
    const theme:themeType = useTheme();
    const navigator = useNavigation();
    const params = useRoute().params;



    useBackHandler(()=>{
      navigator.goBack();
      return true;
    })

      useEffect( ()=>{
        if ( params?.reload){
          console.log(params)
           refetch();
          }
      }, [params])
    
      const current_session = useSelector(store=>store.common.AcademicSession?.current.academic_session_id)
      const user  = useSelector(store=>store.common.User.user);
      const nba_data = useSelector(store=>store?.student?.NbaFeedback)


      const dispatch = useDispatch();

    const {isFetching, isError,error , isRefetching , refetch} =useQuery( studentApi.studentNbaFeedback.name , ()=>studentApi.studentNbaFeedback.fetch(
        {
            computer_code : user.computer_code,
            academic_session : current_session,
        },
    ),
    {
      onSuccess: data => {
        // console.log(data)
        dispatch({type: studentActionTypes.NbaFeedback, payload: [...data]});
      },
    },
  );

    if ( isFetching && !isRefetching) return (
      <CustomLoading />
    )


  if (isError) return <CustomError text="Error Occured" />;

  return (
    <FlatList
          data={nba_data}
          contentContainerStyle={styles.fListContainer}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => <FeedbackItem item={item} />}
          refreshControl={(
            <RefreshControl progressViewOffset={50} progressBackgroundColor={theme.colors.container_background} refreshing={isRefetching} onRefresh={refetch}/>
          )}
          ListEmptyComponent={<NoData text="No Records" />}
        />
  )
}


const FeedbackItem = ({item}:any) =>{
  const theme:themeType = useTheme();
  const navigation = useNavigation();
    const styles = StyleSheet.create({

      listItem:{
        borderRadius : 10,
        margin: 5,
        backgroundColor: theme.colors.white,
        alignSelf: "center",
        maxWidth : 500 ,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      listItemTitle:theme.fonts.bodyLarge

    });
  return (
    <List.Item title={item?.batch} titleEllipsizeMode="tail"
            titleNumberOfLines={5}  
            style={styles.listItem}
            titleStyle={styles.listItemTitle} 
            // @ts-ignore
            onPress={()=>{
              if ( !item?.submitted ) return navigation.navigate("FillNbaFeedback" , {
                feedback_list:item?.co_list
              });
              else return null
            }}

            left={()=>{
              if (item?.submitted) return (<Icon color={theme.colors.green} name="check-circle" style={{alignSelf:"center", marginLeft:10}} size={35} />)
              else return (<Icon color={theme.colors.yellow} name="clock" style={{alignSelf:"center", marginLeft:10}} size={35} />)
            }}
            
            
            right={(props)=>{
              return(
              <Icon name="arrow-right" color={theme.colors.black} style={{alignSelf:"center", marginLeft:10}} size={25} />
              )
            }}
            
          />
  )
}
export default NbaFeedbackStatus
