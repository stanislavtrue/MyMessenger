import { X } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";
import { useState } from "react";
import { useModalAnimation } from "../../hooks/modal/useModalAnimation";

export const AddContactModal = ({ isOpen, onClose, onAdd }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setUsername("");
    };

    const { isClosing, handleClose } = useModalAnimation(isOpen, onClose);

    const handleCancel = () => {
        handleClose(resetForm);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstName.trim() || !username.trim()) return;

        onAdd({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: username.trim(),
        });

        handleClose(resetForm);
    };

    const getInitials = () => {
        const firstLetter = firstName.trim().charAt(0).toUpperCase();
        const lastLetter = lastName.trim().charAt(0).toUpperCase();

        return `${firstLetter}${lastLetter}` || " ";
    };

    const isFormValid = firstName.trim() && username.trim();

    return (
        <ModalWrapper isOpen={isOpen} isClosing={isClosing} onClose={handleCancel}>
            <form 
                onSubmit={handleSubmit}
                className={`
                    flex flex-col pb-4! pt-2! gap-4 bg-[#1C1C1C] rounded-3xl select-none w-100
                    shadow-[0px_0px_5px_rgba(0,0,0,0.8)] border-r! border-l! border-[#2C2C2C]
                    ${isClosing ? "animate-modal-out" : "animate-modal-in"}
                `}
            >
                <div className="flex items-center w-full px-4!">
                    <div 
                        onClick={handleCancel}
                        className="
                            size-10 flex items-center justify-center mr-4! rounded-full
                            hover:bg-[#212121] active:scale-90 active:bg-[#2E2E2E]
                            transition-all duration-200
                        "
                    >
                        <X size={24} className="shrink-0 text-[#959595]"/>
                    </div>
                    <span className="text-xl! font-medium!">Add Contact</span>

                    <button  
                        type="submit"
                        disabled={!isFormValid}
                        className="
                            flex ml-auto! items-center justify-center w-18 h-10
                            bg-[#527AFF]! rounded-2xl font-medium! not-disabled:hover:bg-[#406DFF]!
                            disabled:opacity-30 not-disabled:cursor-pointer transition-all duration-300
                        "
                    >
                        ADD
                    </button>
                </div>

                <div className="flex items-center w-full px-4!">
                    <div className="
                        size-25 bg-linear-to-b from-[#527AFF] to-[#003BFF] rounded-full shrink-0
                        flex items-center justify-center text-4xl! font-semibold!
                    ">
                        {getInitials()}
                    </div>
                    <div className="flex flex-col w-full gap-4 pl-4!">
                        <div className="relative flex items-center justify-center w-full group">
                            <input 
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder=" "
                                className="
                                    h-10 w-full rounded-xl outline-none! ring-[1.5px]! ring-white/10
                                    px-4! group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]!
                                    group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]!
                                    group-focus-within:ring-2! peer
                                    transition-all duration-200
                                "
                            />
                            <label 
                                htmlFor="firstName" 
                                className="
                                    absolute left-4 origin-left transform text-[#959595] group-hover:text-[#527AFF]
                                    group-focus-within:text-[#527AFF] group-focus-within:-translate-y-5 group-focus-within:-translate-x-2
                                    group-focus-within:text-xs! group-focus-within:bg-[#1C1C1C] group-focus-within:px-1! group-focus-within:font-medium!
                                    duration-200 cursor-text not-peer-placeholder-shown:-translate-y-5 not-peer-placeholder-shown:-translate-x-2
                                    not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#1C1C1C]
                                "
                            >
                                First name (required)
                            </label>
                        </div>
                        <div className="relative flex items-center justify-center w-full group">
                            <input 
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder=" "
                                className="
                                    h-10 w-full rounded-xl outline-none! ring-[1.5px]! ring-white/10
                                    px-4! group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]!
                                    group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]!
                                    group-focus-within:ring-2! peer
                                    transition-all duration-200
                                "
                            />
                            <label 
                                htmlFor="lastName" 
                                className="
                                    absolute left-4 origin-left transform text-[#959595] group-hover:text-[#527AFF]
                                    group-focus-within:text-[#527AFF] group-focus-within:-translate-y-5 group-focus-within:-translate-x-2
                                    group-focus-within:text-xs! group-focus-within:bg-[#1C1C1C] group-focus-within:px-1! group-focus-within:font-medium!
                                    duration-200 cursor-text not-peer-placeholder-shown:-translate-y-5 not-peer-placeholder-shown:-translate-x-2
                                    not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#1C1C1C]
                                "
                            >
                                Last name (required)
                            </label>
                        </div>
                        
                    </div>
                </div>

                <div className="relative flex items-center justify-center w-full px-4! group">
                    <span className={`
                        absolute left-6 select-none z-10 opacity-0 transition-opacity duration-200
                        group-focus-within:opacity-100 pointer-events-none
                        ${username ? "opacity-100" : "opacity-0"}
                    `}>
                        @
                    </span>

                    <input 
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder=" "
                        className="
                            h-10 w-full rounded-xl outline-none! ring-[1.5px]! ring-white/10
                            pr-4! pl-7! group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]!
                            group-focus-within:ring-2! group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]!
                            transition-all duration-200 peer
                        "
                    />
                    <label 
                        htmlFor="username"
                        className="
                            absolute left-8 top-1.5 origin-left transform text-[#959595] group-hover:text-[#527AFF]
                            group-focus-within:text-[#527AFF] group-focus-within:-translate-y-5 group-focus-within:-translate-x-2
                            group-focus-within:text-xs! group-focus-within:bg-[#1C1C1C] group-focus-within:px-1! group-focus-within:font-medium!
                            duration-200 cursor-text not-peer-placeholder-shown:-translate-y-5 not-peer-placeholder-shown:-translate-x-2
                            not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#1C1C1C]
                        "
                    >
                        Username
                    </label>
                </div>

            </form>
        </ModalWrapper>
    );
}
