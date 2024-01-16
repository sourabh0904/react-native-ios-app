import { type } from "os";
import { api } from "../../apiConfig";
import commonUrl from "./urls";


const commonApi = {
    academicSession : {
        name : "academicSession",
        fetch : ()=>api.get(commonUrl.academicSession).then(res=>res.data)

    },
};

export default commonApi;