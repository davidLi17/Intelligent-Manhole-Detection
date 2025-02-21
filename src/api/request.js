import axios from "axios";

const request = axios.create({
	baseURL: "http://101.126.18.51:3000",
	timeout: 3600000,
});

// http://101.126.18.51:3000

request.interceptors.request.use(
	(config) => {
		// 可以在这里添加例如token等请求头
		config.headers["authorization"] = localStorage.getItem("token");
		return config;
	},
	(error) => {
		// 请求错误处理
		return Promise.reject(error);
	}
);

//   // 添加响应拦截器
//   apiClient.interceptors.response.use(response => {
//     // 对响应数据做处理
//     return response.data;
//   }, error => {
//     // 响应错误处理
//     return Promise.reject(error);
//   });
export default request;
