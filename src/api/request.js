import axios from "axios";

const request = axios.create({
	baseURL: 'http://localhost:8080', // 后端地址
	timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
	config => {
		// 在发送请求之前可以添加一些公共的请求头，例如 token
		const token = localStorage.getItem('token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}

)

// 响应拦截器
request.interceptors.response.use(
	response => {
		// 这里可以对响应数据进行一些处理，例如统一处理错误码
		return response.data;
	},
	error => {
		// 这里可以对响应错误进行一些处理，例如统一处理错误提示
		console.error('请求错误:', error);
		return Promise.reject(error);
	}
)

export default request;