import axios from "axios";

export const api = axios.create({
	baseURL: 'http://10.10.6.121:3333'
})