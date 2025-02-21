import request from "./request.js"
export const getMonth = () => {
    return request({
        url: '/api/screenView/monthly-upload-stats',
        method: 'get',
    })
}
export const getWeek = (time) => {
    return request({
        url: '/api/screenView/weekly-daily-stats',
        method: 'get',
        params:{
            startOfWeek : time
        }
    })
}
export const getDay = (time) => {
    return request({
        url: '/api/screenView/daily-stats',
        method: 'get',
        params:{
            date : time
        }
    })
}