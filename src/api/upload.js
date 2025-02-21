import request from "./request.js"
export const Upload = (file) => {
    return request({
        url: '/api/mediaFile/upload',
        method: 'post',
        data:{
            file:file,
        },
        headers:{
            'Content-Type': 'multipart/form-data;>',
        }
    })
}

export const UploadMoreImages = (formData) => {
    return request({
        url: '/api/mediaFile/uploadMoreImages',
        method: 'post',
        data:formData,
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
}
