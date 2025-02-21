import request from "./request.js"
export const getAllUser = () => {
    return request({
        url: '/users/getAllUser',
        method: 'post',

    })
}
export const historiesAssign = (hid,aid) => {
    return request({
        url: '/api/histories/assign',
        method: 'post',
        data:{
            HistoryId:hid,
            assignedUserId:aid
        }
    })
}