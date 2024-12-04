import { io } from "socket.io-client";
import { externalURL } from "../api/axiosConfig";

const socket = io(externalURL);

export default socket;
