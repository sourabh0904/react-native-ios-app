import { api } from "../../apiConfig";
import { getToken } from "../../utils/notification";
import staffUrl from "./urls";

export type loginPayload ={
    computer_code: number,
    password: string
  }


const staffApi = {
    login : {
        name : "login" , 
        fetch : (payload:loginPayload)=>api.post(staffUrl.login , {...payload,deviceToken:"jhgjg" }).then(res=>res.data) 
    }
};

export default staffApi;