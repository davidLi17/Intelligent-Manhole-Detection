import request from "./request.js"
export const Login = (form) => {
    return request({
        url: '/users/login',
        method: 'post',
        data:{
            username: form.username,
            password:form.password
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
    })
}
export const Register = (form) => {
    return request({
        url: '/users/register',
        method: 'post',
        data:{
            username: form.username,
            password:form.password,
            email:form.email,
            name:form.username,
            identity:'checker',
            code:form.code
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
    })
}
export const LoginOut = () => {
    return request({
        url: '/users/logout',
        method: 'post',
    })
}
export const reToken = () => {
    return request({
        url: '/refreshToken',
        method: 'get',
    })
}
export const sendEmail = (email) => {
    return request({
        url: '/users/sendEmail',
        method: 'post',
        data:{
            email:email
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
    })
}
export const getTitle = () => {
    return request({
        url: '/users/deCodeToken/250',
        method: 'post',
    })
}