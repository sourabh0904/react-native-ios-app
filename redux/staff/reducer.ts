

type reducerData = {
}

const initialState:reducerData = {
};

export default function staffReducer(state:reducerData = initialState , action: any):reducerData{
    switch (action.type){
        default :
            return state;
    }
}