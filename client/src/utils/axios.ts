import axios from "axios";
console.log(process.env.SERVER_HOST)
const axiosInstance = axios.create({
    baseURL: process.env.SERVER_HOST
})
export default axiosInstance