import axios from "axios";
import { getJwtToken } from "../libs/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const token = getJwtToken();

export const api = axios.create({
    baseURL: apiUrl + '/',
    headers: {
        Authorization: 'Bearer ' + token
    }
})
