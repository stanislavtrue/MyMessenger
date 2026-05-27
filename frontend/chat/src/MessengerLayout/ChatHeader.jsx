import { Heading } from "@chakra-ui/react";

export const ChatHeader = ({ chat }) => {
    return (
        <div className="
            w-full h-14
            bg-[#1F1F28] 
            flex items-center
            m-auto!
            select-none
        ">


            <div className="w-10 h-10 rounded-full bg-[#5A4282] flex items-center justify-center text-white! text-xl! ml-4!">
                {chat.name[0]}
            </div>

            <div className="flex flex-col ml-2! min-w-0">

                <span className="text-white text-lg! truncate">
                    {chat.name}
                </span>
                
                <span className="text-[#52526B] text-sm!">
                    Online
                </span>

            </div>
        </div>
    );
}
