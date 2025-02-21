import request from "./request.js"
//在title这里填日期
export const AddToHistory = (form) => {
    
    return request({
        url: '/api/histories/add',
        method: 'post',
        data: {
            userId: form.userId,
            location: form.location,
            title: form.title, //目前用于储存拍摄日期
            info: form.info,
            longitude: form.longitude,
            latitude: form.latitude,
            url: form.url,
            predictedUrl: form.predictedUrl,
            repairer: form.repairer, //维修员名字
            damageType: form.damageType,
            isRepaired: form.isRepaired, //后端参数类型基本全是字符串
            prediction: form.prediction,
            confidence: form.confidence

        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },

    })
}
export const ShowHistory = () => {
    return request({
        url: '/api/histories/all',
        method: 'get',

    })
}

export const getRepairedCovers = () => {
    return request({
        url: '/api/histories/repairedCovers',
        method: 'get',

    })
}

export const getUnRepairedCovers = () => {
    return request({
        url: '/api/histories/unrepairedCovers',
        method: 'get',

    })
}
export const getRecordById = (userId) => {
    return request({
        url: '/api/histories/recordById',
        method: 'get',
        data:{
            userId:userId
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}
export const getRecordByRepairer = () => {
    return request({
        url: '/api/histories/recordByRepairer',
        method: 'get',
    })
}
export const getHistoryById = (HistoryId) => {
    return request({
        url: '/api/histories/getHistoryById',
        method: 'get',
        params:{
            HistoryId:HistoryId
        },

    })
}
export const upDate = (HistoryId, updateData) => {
    return request({
        url: '/api/histories/update',
        method: 'post',
        data:{
            HistoryId:HistoryId,
            updateData:JSON.stringify(updateData)
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}