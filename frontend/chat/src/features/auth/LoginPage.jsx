import { useState } from "react";
import connection from "../messenger/services/chatHub";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5079/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok === false) {
            console.log(response.statusText)
            return;
        }
        
        const accessToken = data.accessToken

        localStorage.setItem("accessToken", accessToken);

        navigate("/test");
    };

    return (
        <div className="h-screen flex items-center justify-center" >
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
            <form 
                onSubmit={handleSubmit}
                className="
                    relative flex flex-col pb-4! pt-4!
                    bg-[#1E1E22] rounded-3xl select-none w-100
                    shadow-[0px_0px_5px_rgba(0,0,0,0.8)]
                "
            >
                <div className="
                    size-32 mx-auto! bg-[#8774E4] rounded-full shrink-0
                    flex items-center justify-center text-4xl! font-semibold!
                "/>

                <div className="font-medium! text-[24px]! mx-auto! pt-4!">
                    Log in to Messenger
                </div>
                <div className="text-[16px]! mx-auto! max-w-60 text-center text-white/60">
                    Please enter your email and password
                </div>

                <div className="flex flex-col w-full gap-6 px-4! pt-6!">
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]! ring-white/10
                                px-4! group-hover:ring-[#8774E4] group-hover:placeholder-[#8774E4]!
                                group-focus-within:ring-[#8774E4] group-focus-within:placeholder-[#8774E4]!
                                group-focus-within:ring-2! peer
                                transition-all duration-200
                            "
                        />
                        <label 
                            htmlFor="email" 
                            className="
                                absolute left-4 origin-left transform text-white/50 group-hover:text-[#8774E4]
                                group-focus-within:text-[#8774E4] group-focus-within:-translate-y-5 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#1E1E22] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-5 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#1E1E22]
                            "
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            className="
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]! ring-white/10
                                px-4! group-hover:ring-[#8774E4] group-hover:placeholder-[#8774E4]!
                                group-focus-within:ring-[#8774E4] group-focus-within:placeholder-[#8774E4]!
                                group-focus-within:ring-2! peer
                                transition-all duration-200
                            "
                        />
                        <label 
                            htmlFor="password" 
                            className="
                                absolute left-4 origin-left transform text-white/50 group-hover:text-[#8774E4]
                                group-focus-within:text-[#8774E4] group-focus-within:-translate-y-5 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#1E1E22] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-5 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#1E1E22]
                            "
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative flex items-center justify-center w-full group">
                        <button 
                            className="h-12 w-full rounded-2xl bg-[#8774E4]! cursor-pointer text-lg! font-bold! hover:bg-[#6F57E8]!
                            transition-all duration-200"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
