// src/api/axiosConfig.js
import axios from "axios";

const baseURL = "https://company3-externalserver.azurewebsites.net"; // URL to Azure Cloud Server
//const baseURL = "http://127.0.0.1:5000"; // URL to local server

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { baseURL, axiosInstance };
