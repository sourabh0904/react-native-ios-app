export type staffActionType = {
    action :  (typeof staffActionTypes)[number],
    payload : object | any,
    successCB? : any,
}

export const staffActionTypes = [
    'some',
    'hello'
] as const;