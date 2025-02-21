import axios from "axios";
const vanna = axios.create({
	baseURL: "/vanna/api/v0",
	headers: {
		"Content-type": "application/json",
	},
});
vanna.interceptors.request.use((config) => {
	// const token = localStorage.getItem("token");
	// if (token) {
	// config.headers.Authorization = `Bearer ${token}`;
	// }
	return config;
});
vanna.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		// if (error.response.status === 401) {
		// localStorage.removeItem("token");
		// window.location.href = "/login";
		// }
		return error;
	}
);
export default vanna;
