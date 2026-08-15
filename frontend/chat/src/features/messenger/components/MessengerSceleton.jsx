import { SlMagnifier } from "react-icons/sl";
import { TfiMenu } from "react-icons/tfi"

export const MessengerSceleton = ({}) => {
    const ChatItemSkeleton = () => (
        <div className="relative flex items-center gap-3 px-2! py-2! w-[97%] m-auto!">
            <div className="w-14 h-14 rounded-full bg-[#111111] animate-pulse" />

            <div className="flex flex-col items-start gap-3">
                <div className="h-3 w-16 rounded-full bg-[#111111] animate-pulse" />
                <div className="h-3 w-50 rounded-full bg-[#111111] animate-pulse" />
            </div>

            <div className="absolute top-3 right-2 h-3 w-10 rounded-full bg-[#111111] animate-pulse" />
        </div>
    );

    return (
        <div className="h-screen flex relative" >
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg,#330033,#6600ff,#ff9900)",

                    WebkitMaskImage: "url('/background.png')",
                    WebkitMaskRepeat: "repeat",
                    WebkitMaskSize: "450px",

                    maskImage: "url('/background.png')",
                    maskRepeat: "repeat",
                    maskSize: "450px",

                    opacity: 0.3
                }}
            />

            <div className="p-4! h-screen w-162.5">
                <div className="h-full w-full flex flex-col bg-[#1F1F28]/60 rounded-3xl">
                    <div className="mx-4! pt-2! pb-3! text-center">
                        <div className="flex items-center relative">
                            <div className="relative flex items-center justify-center h-11 w-11 ">
                                <TfiMenu size={22} className="absolute text-white"/>
                            </div>
                            <div className="w-full flex flex-1 items-center bg-[#111111] rounded-3xl ml-3! pl-4!">
                                <SlMagnifier size={18} strokeWidth={50} className="text-[#7F88C0]" />

                                <div className="w-full flex items-center h-10! pl-3! rounded-3xl text-white">
                                    <span className="text-[#7F88C0] select-none">Search</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {Array.from({ length: 11 }).map((_, index) => (
                        <ChatItemSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
