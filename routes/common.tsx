import { ParamListBase, RouteConfig, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import LoginPage from "../screens/common/login/loginPage";
import Dashboard from "../screens/common/dashborad/dashboard";
import { storage } from "../App";
import Notification from "../screens/common/notification/notification";
import About from "../screens/common/About/about";
import ContactUs from "../screens/common/contactUs/contactUs";

const commonScreenProps:(RouteConfig<ParamListBase, string, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap>)[] = [
    {
        name: "Login",
        component: LoginPage,
        options:{
            animation : 'fade'
        }
    },
    {
        name: "Dashboard",
        component: Dashboard,
        options:{
            animation :"fade_from_bottom"
        }
    },
    {
        name: "Notification",
        component: Notification,
        options:{
            animation :"slide_from_left",
            headerShown:true
        },
    },
    {
        name: "About",
        component: About,
        options:{
            animation :"slide_from_left",
            headerShown:true
        },
    },
    {
        name: "Contact",
        component: ContactUs,
        options:{
            animation :"slide_from_left",
            headerShown:true
        },
    },
]

export default commonScreenProps;