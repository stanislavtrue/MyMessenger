import { HubConnectionBuilder } from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5079/chatHub", {
        accessTokenFactory: () => {
            return localStorage.getItem("accessToken");
        }
    })
    .withAutomaticReconnect()
    .build();

export default connection;
