import { type } from "os";
import { StatusBar, StatusBarStyle } from "react-native";
import { useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { Platform } from "react-native";
import { ReactNode } from "react";

type props = {
    children : ReactNode,
    color? : string,
    barStyle? : StatusBarStyle
};


function IosSafeArea(props: props) {
    const theme = useTheme();
  return (
    <SafeAreaView style={{flex :1 }}>
        <StatusBar  barStyle={props.barStyle}  backgroundColor={props.color?props.color : 'transparent'}  />
        {props.children}
    </SafeAreaView>
    )
}

export default IosSafeArea