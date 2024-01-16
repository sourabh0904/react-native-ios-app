import { commonActionTypes } from "./types";
import { userType } from "../../constants";


type reducerData = {
    User : {
        user:{
            computer_code? : number ,
            academic_session? : string,
            address? : string,
            department? : string,
            dob? : string,
            email? : string,
            enrollment? : string,
            father_name? : string,
            mother_name? : string,
            gender? : string,
            homedept? : number,
            name? : string,
            student_mobile : string,
            student_session : {
                name : string,
                student_session_id : number ,
            },
            studydept : 21,
            type : typeof userType

            [key:string] : any
        }|{},
        [key:string] : any
    },
    Notification:Array<Object>,
    AcademicSession : {
        sessions : object[],
        current : any
    }
}

const initialState:reducerData = {
    User : { user : {}},
    Notification:[],
    AcademicSession:{
        sessions : [],
        current : {}
    }
};

export default function commonReducer(state:reducerData = initialState , action: any):reducerData{
    switch (action.type){
        case commonActionTypes.UserLoginDetails : 
            return {
                ...state , User : action.payload
            }

        case commonActionTypes.ClearUserLoginDetails:
            return {
                ...state , User : {}
            }
        

        case commonActionTypes.ClearNotification:
            return {
                ...state , Notification : []
            }
        
        case commonActionTypes.GetNotification:
            return {
                ...state , Notification : [action.payload,...state.Notification]
            }
        
        case commonActionTypes.AcademicSession:
            return {
                ...state , AcademicSession : { sessions : action.payload.sessions , current : action.payload.current} 
            }
        
        default :
            return state;
    }
}