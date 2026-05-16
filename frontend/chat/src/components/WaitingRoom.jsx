import { Button, Heading, Input, Text, Stack, Box } from "@chakra-ui/react"
import { useState } from "react";

export const WaitingRoom = ({ joinChat }) => {
    const [userName, setUserName] = useState("");
    const [chatRoom, setChatRoom] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        joinChat(userName, chatRoom);
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm w-full bg-white !p-8 rounded shadow-lg">
            <Heading color="#000000ff">Online Chat</Heading>
            <div className="!mb-4">
                <Text fontSize={"sm"} color="#555555ff">User name</Text>
                <Input 
                    onChange={(e) => setUserName(e.target.value)} 
                    name="useName" 
                    placeholder="Enter your name"
                    color="black" />
            </div>
            <div className="!mb-4">
                <Text fontSize={"sm"} color="#555555ff">Chat name</Text>
                <Input
                    onChange={(e) => setChatRoom(e.target.value)} 
                    name="chatRoom" 
                    placeholder="Enter chat name"
                    color="black" />
            </div>
            <Button className="!bg-blue-500 hover:!bg-blue-600 !text-white" type="submit">Connect</Button>
        </form>
    );
};
