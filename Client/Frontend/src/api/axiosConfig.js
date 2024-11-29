// src/api/axiosConfig.js
import axios from "axios";

//const baseURL = "https://company3-externalserver.azurewebsites.net"; // URL to Azure Cloud Server
//const lanURL = "https://airedale-engaging-easily.ngrok-free.app" // URL to Raspberry Pi LAN-Server
const externalURL = "http://127.0.0.1:5000"; // URL to local server
const lanURL = "http://127.0.0.1:5100";

const axiosInstance = axios.create({
  baseURL: externalURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { externalURL, lanURL, axiosInstance };
