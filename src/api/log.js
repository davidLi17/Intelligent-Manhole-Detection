import request from "./request.js"
export const getLogByHistoryId = (historyId) => {
    return request({
        url: '/api/repairLog//history/'+ historyId,
        method: 'get',
        
    })
}

export const addLog = (description,detectionHistoryId) => {
    return request({
        url: '/api/repairLog/create',
        method: 'post',
        data:{
            description,
            detectionHistoryId
        }
    })
}