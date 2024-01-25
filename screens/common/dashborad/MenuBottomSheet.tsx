import { Dimensions, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { themeType } from '../../../theme';
import MenuList from './MenuList';
import { useTheme } from 'react-native-paper';
import { useReducedMotion } from 'react-native-reanimated';

type menuProp = {
    open : boolean,
    changeOpen : any
}


const MenuBottomSheet = (props : menuProp) => {
    const theme:themeType = useTheme();
    const styles = StyleSheet.create({
        ModalSheetStyle: {
            borderRadius: 35,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 24,
            padding: 20,
          },
          bottomSheetContainer: {
            padding: 20,
            backgroundColor: theme.colors.backdrop,
          },
    });
  const Modalref: any = useRef<BottomSheet>(null);

  useEffect(()=>{
    console.log(props.open);
    if ( props.open) Modalref.current.present();
    else Modalref.current.dismiss();
  },[props.open])

  const window = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  return (
    <Pressable onPress={()=>props.changeOpen(false)} style={{height:window.height, width:window.width, position:"absolute" , display:props.open?"flex":"none" }}>
     <BottomSheetModal
     animateOnMount={!reducedMotion}
              ref={Modalref}
              index={0}
              snapPoints={[310]}
              enableDismissOnClose
              backgroundStyle={styles.ModalSheetStyle}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.primary,
                width: 100,
                height: 5,
              }}
              onDismiss={()=>props.changeOpen(false)}
              containerStyle={styles.bottomSheetContainer}
              >
              <View style={{padding: 10}}>
                <MenuList Modalref={Modalref} />
              </View>
            </BottomSheetModal>
            </Pressable>
  )
}

export default MenuBottomSheet
