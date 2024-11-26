// src/api/axiosConfig.js
import axios from "axios";

//const baseURL = "https://company3-externalserver.azurewebsites.net"; // URL to Azure Cloud Server
const externalURL = "https://company3-externalserver.azurewebsites.net"; // URL to local server
const lanURL = "http://127.0.0.1:5100";

const axiosInstance = axios.create({
  baseURL: externalURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { externalURL, lanURL, axiosInstance };
