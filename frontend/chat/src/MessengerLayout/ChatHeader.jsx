import { Heading } from "@chakra-ui/react";
import { ChatItem } from "./ChatItem"

export const ChatHeader = ({ chat }) => {
    return (
        <div className="
            w-[90%] h-14 
            bg-[#1F1F28] 
            flex items-center justify-between
            rounded-4xl 
            !mt-4 !mx-auto !px-5
        ">

            <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-[#957AAA] flex items-center justify-center !text-white !text-xl">
                    {chat.name[0]}
                </div>

                <div className="flex text-white !text-xl">
                    {chat.name}
                </div>

            </div>

            <div className="!text-xl text-[#52526B]">
                Online
            </div>

        </div>
    );
}
