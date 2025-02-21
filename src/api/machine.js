import request from "./request.js"
export const Upload = (image) => {
    return request({
        url: '/image',
        method: 'post',
        data:{
            image:image,
        },
        headers:{
            'Content-Type': 'multipart/form-data;>',
        }
    })
}