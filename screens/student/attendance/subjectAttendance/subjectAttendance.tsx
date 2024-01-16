import { BackHandler, StyleSheet, ScrollView, View , FlatList, useWindowDimensions, Pressable } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { List, useTheme, Text ,Chip, Surface, Title, TouchableRipple} from 'react-native-paper';
import { themeType } from '../../../../theme';
import dayjs from 'dayjs';
import NoData from '../../../../components/noData';
import CMScard from '../../../../components/cms_card';
import { Calendar } from 'react-native-calendars';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Marking, { MarkingProps, Markings } from 'react-native-calendars/src/calendar/day/marking';
import { MarkedDates } from 'react-native-calendars/src/types';
import { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProgressCustom from '../../../../components/progressCustom';
import { useBackHandler } from '@react-native-community/hooks';


const SubjectAttendance:FC<any> = () => {
    const navigator = useNavigation();
    const params:any = useRoute().params;
    const theme:themeType = useTheme();
    const window = useWindowDimensions();
    const styles = StyleSheet.create({
        calendarStyle : {
            minWidth: 200,
            width :window.width - 30 ,
            maxWidth: 600,
            borderRadius: 35,
            padding: 15,
            backgroundColor: theme.colors.cms_card_background,
        },
        progressScroll:{
            flexDirection: 'row',
            flex:1,
            alignSelf:"center"
        },
        progressCard:{
            padding: 10,
            gap : 10,
            width : 150,
            justifyContent:'center',
        }
    })
    
    useEffect( ()=>{
        navigator.setOptions({title : params?.title })
    } , [params])

    useBackHandler(()=>{
        navigator.goBack();
        return true;
      })

    const init_summary = {
        present_days : 0,
        absent_days : 0,
        total_days : 0, 
        absent_list : [],
        present_list : [],
        dates : new Set(),
        markings : {},
    }

    const [summary , setSummary] = useState<{
        present_days: number;
        absent_days: number;
        total_days: number;
        absent_list: never[];
        present_list: never[];
        dates: Set<unknown>;
        markings: MarkedDates;
    }>(init_summary);

    useEffect(()=>{
        if ( params?.lectures){
            let update = init_summary;
            params?.lectures.map(item=>{
                if (item.attendance == 1){
                    if (!update.dates.has(item.date)) update.present_days++ ;
                    // @ts-ignore
                    update.present_list.push(item);                    
                }
                
                if (item.attendance == 0){
                    if (!update.dates.has(item.date)) update.absent_days++ ;
                    // @ts-ignore
                    update.absent_list.push(item);
                    }
                if (!update.dates.has(item.date)) update.total_days++;
                update.dates.add(item.date);

                if ( !update.markings[item.date]){
                    let dot = dots[item.lecture_type]
                    let textColor = item.attendance?theme.colors.green:theme.colors.red
                    let selectedColor = item.attendance?theme.colors.container_green:theme.colors.container_red
                    update.markings[dayjs(item.date).format("YYYY-MM-DD")]={
                        dots : [dot],
                        marked : true,
                        selected : true,
                        selectedTextColor : textColor,
                        selectedColor,
                        
                        
                    }
                }else{
                    update.markings[item.date]['dots']?.push(dots[item.lecture_type])
                }

            });
            update.total_days = update.dates.size;
            setSummary({...update});
        }
    } , [params])

    const dots = {
                Theory:{
                    key:"Theory",
                    color : "yellow",
                },
                Tutorial:{
                    key : "Tutorial",
                    color : "cyan",
                },
                MST:{
                    key : "MST",
                    color : "magenta",
                },
                Practical:{
                    key : "Practical",
                    color : "orange",
                },
    }

    const [sheet , setSheet] = useState({
        lectures : [],
        open : false
    });

    const total_attendance_list = useMemo(()=>params.lectures  , [params.lectures])
    const present_attendance_list = useMemo(()=>params.lectures.filter(item=>item.attendance)  , [params.lectures])
    const absent_attendance_list = useMemo(()=>params.lectures.filter(item=>!item.attendance)  , [params.lectures])



    const setSheetData = useCallback(value=>setSheet({...sheet , open:value} ) ,[sheet] )
    
    return (
        <GestureHandlerRootView style={{flex: 1}}>

        <BottomSheetModalProvider>
            <ScrollView style={{ marginTop : 50  , maxWidth:1000 , alignSelf: 'center',}}>
                <View style={{padding:10}}>
                    <Text variant='headlineSmall'  > Attendance Summary</Text>
                </View>
                <CMScard style={{gap:10  , maxWidth : 500}}>
                    <View style={{flex:1,borderRightWidth:2 , borderColor:theme.colors.primary}}>
                        <Text variant='titleMedium'  >Overall Attendance</Text>
                        <Text variant='labelMedium' style={{color:theme.colors.primary  }}>{summary.present_days}/{summary.total_days} days</Text>
                    </View>
                    <Text variant='displaySmall' style={{color : theme.colors.primary}}>
                        {Math.round((summary.present_days/summary.total_days)*100)}%
                    </Text>
                </CMScard>
                <ScrollView  overScrollMode='always' horizontal={true} style={styles.progressScroll} contentContainerStyle={{justifyContent:"center"}}>
                    <TouchableRipple onPress={()=>setSheet({
                        lectures : absent_attendance_list,
                        open:true
                    })}>
                    <CMScard style={styles.progressCard}>
                            <ProgressCustom
                                    size={45}
                                    width={5}
                                    fill={((summary.absent_days/summary.total_days)*100)}
                                    color='red'
                                    >
                            {(fill)=><Text numberOfLines={2} ellipsizeMode='tail' variant='labelMedium'>{Math.round((summary.absent_days/summary.total_days)*100)}%</Text>}
                          </ProgressCustom>
                          <View>
                            <Text variant='labelLarge'>Absent</Text>
                            <Text variant='labelMedium' style={{color:theme.colors.red}}>{summary.absent_days} days</Text>

                          </View>
                    </CMScard>
                    </TouchableRipple>
                    <TouchableRipple onPress={()=>setSheet({
                        lectures : present_attendance_list,
                        open:true
                    })}>
                    <CMScard style={styles.progressCard}>
                            <ProgressCustom
                                    size={45}
                                    width={5}
                                    fill={(summary.present_days/summary.total_days)*100}
                                    color='green'
                                    >
                            {(fill)=><Text numberOfLines={2} ellipsizeMode='tail' variant='labelMedium'>{Math.round((summary.present_days/summary.total_days)*100)}%</Text>}
                          </ProgressCustom>
                          <View>
                            <Text variant='labelLarge'>Present</Text>
                            <Text variant='labelMedium' style={{color:theme.colors.green}}>{summary.present_days} days</Text>

                          </View>
                    </CMScard>
                    </TouchableRipple>
                    <TouchableRipple onPress={()=>setSheet({
                        lectures : total_attendance_list,
                        open:true
                    })}>
                    <CMScard style={styles.progressCard}>
                            <ProgressCustom
                                    size={45}
                                    width={5}
                                    fill={(summary.present_days/summary.total_days)*100}
                                    color='blue'
                                    >
                            {(fill)=><Text numberOfLines={2} ellipsizeMode='tail' variant='labelMedium'>{Math.round((summary.present_days/summary.total_days)*100)}%</Text>}
                          </ProgressCustom>
                          <Text variant='labelLarge'>Total</Text>
                    </CMScard>
                    </TouchableRipple>
                </ScrollView>
                <View style={{padding:10}}>
                    <Text variant='headlineSmall'  > Monthly attendance</Text>
                </View>
                <CMScard style={{padding:0 ,}}>
                    <Calendar enableSwipeMonths  hideExtraDays
                    style={styles.calendarStyle}
                    theme={{
                        arrowColor:theme.colors.primary,
                        todayTextColor:theme.colors.primary,
                        todayBackgroundColor:theme.colors.container_background,
                        textSectionTitleColor:theme.colors.black
                    }}
                    markingType='multi-dot'
                    markedDates={summary.markings }
                    onDayPress={date=>{
                        setSheet({
                        lectures : params?.lectures.filter(item=>dayjs(item.date).format("YYYY-MM-DD")===date.dateString),
                        open: true
                        })
                    }}
                      />
                </CMScard>
                <AttendanceListBottomSheet open={sheet.open} lectures={sheet.lectures} setModal={setSheetData} />
            </ScrollView>
            </BottomSheetModalProvider>
            </GestureHandlerRootView>
          )
      }
    
        
const AttendanceListBottomSheet= props=>{

            const theme:themeType = useTheme();
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
                listItemTitle:{
                  fontSize: 18,
                  fontWeight : "800",
        
                },
                description:{
                    padding : 10
                },
                listItemPresent :{
                    backgroundColor : theme.colors.container_green,
                    borderColor : theme.colors.green,
                    borderWidth: 0,
                    borderRadius: 20,
                },
                listItemAbsent :{
                    backgroundColor : theme.colors.container_red,
                    borderColor : theme.colors.red,
                    borderWidth: 0,
                    borderRadius: 20,
                },
                listItemTitlePresent:{
                    color : theme.colors.green,
                },
                listItemTitleAbsent:{
                    color : theme.colors.red,
                },
                ModalSheetStyle: {
                    borderRadius: 35,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 12,
                },
               },
                bottomSheetContainer: {
                    padding: 20,
                    backgroundColor: theme.colors.backdrop,
                  },
          
              });


              const Modalref = useRef(null);

              useEffect(()=>{
                // @ts-ignore
                if (props.open) Modalref.current?.present()
                // @ts-ignore
                else Modalref.current?.dismiss()
            
              } , [props.open , Modalref])

              const window = useWindowDimensions();


              const dismissModal = useCallback(()=>props.setModal(false) , [])

            return (

            <Pressable onPress={()=>props.setModal(false)} style={{height:window.height, width:window.width, position:"absolute" , display:props.open?"flex":"none" }}>
            <BottomSheetModal
                ref = {Modalref}
                index={0}
                enableDismissOnClose
                snapPoints={[500 , window.height - 100]}
                onDismiss={dismissModal}
                containerStyle={styles.bottomSheetContainer}
                backgroundStyle={styles.ModalSheetStyle}
                handleIndicatorStyle={{
                    backgroundColor: theme.colors.primary,
                    width: 100,
                    height: 5,
                }}
                
                >
            {!props.lectures.length?
            <NoData text="No Records" />
            :
            <BottomSheetFlatList
            data={props.lectures}
            keyExtractor={(item , index)=>`${index}`}
            contentContainerStyle={{ paddingTop:50, paddingBottom:20 , gap:10}}
            renderItem={({item})=>{
                return (
                    <List.Item
                    // @ts-ignore
                    title={item.attendance?"Present":"Absent"}
                    titleNumberOfLines={1}
                    // @ts-ignore
                    style={[styles.listItem, item.attendance?styles.listItemPresent:styles.listItemAbsent]}
                    // @ts-ignore
                    titleStyle={[styles.listItemTitle, item.attendance?styles.listItemTitlePresent:styles.listItemTitleAbsent]}
                    description={()=>(
                        <View style={styles.description}>
                                        <Text variant='labelLarge' numberOfLines={1} ellipsizeMode='tail' >Time - {item.time_slot}</Text>
                                        <Text variant='labelLarge' numberOfLines={1} ellipsizeMode='tail' >Lecture Type - {item.lecture_type}</Text>
                                    </View>
                                )}
                                onPress={()=>null}
                                right={(props)=>{
                                    let date = dayjs(item.date).format("DD-MM-YYYY");
                                    return (
                                        <Chip mode="outlined" 
                                        compact
                                        style={[{height:35, borderRadius:20},item.attendance?styles.listItemPresent:styles.listItemAbsent ]} >
                                            <Text>{date}</Text>
                                        </Chip>
                                    )
                                }}
                            />
                        )
                    }}
                    />
                }
                </BottomSheetModal>
                </Pressable>
    )}



export default SubjectAttendance;