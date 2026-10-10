import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, EyeClosed } from "lucide-react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const handleFieldChanged = (field, value, setter) => {
        setter(value);

        setTouched((prev) => ({
            ...prev,
            [field]: true
        }));

        setError("");

        setFieldErrors((prev) => ({
            ...prev,
            [field]: "",
            ...(field === "password" && field === "confirmPassword" 
                ? { confirmPassword: "" }
                : {}),
        }));
    };

    const fieldOrder = [
        "username",
        "email",
        "password",
        "confirmPassword"
    ];

    const getFirstError = (errors) =>
        fieldOrder
            .map((field) => errors[field])
            .find((message) => Boolean(message)) ?? "";

    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const errors = {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        };

        if (!username.trim()) {
            errors.username = "Username is required.";
        } else if (username.length < 3) {
            errors.username = "Username must be at least 3 characters.";
        }
        
        if (!email.trim()) {
            errors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            errors.email = "Invalid email format.";
        }
        
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setFieldErrors(errors);

        if (Object.values(errors).some(Boolean)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5079/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });

            if (!response.ok) {
                setError(response.status === 409 
                    ? "Username or email is already taken." 
                    : "Registration failed. Please try again.");

                return;
            }

            navigate("/login");
        } catch {
            setError("Could not connect to the server.")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center" >
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg,#1C1C1C,#313131,#717171)",

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
                    bg-[#171717] rounded-3xl select-none w-100
                    border-r! border-l! border-[#2C2C2C]
                    shadow-[0px_0px_5px_rgba(0,0,0,0.8)]
                "
            >
                <div className="
                    size-32 mx-auto! bg-[#527AFF] rounded-full shrink-0
                    flex items-center justify-center text-4xl! font-semibold!
                "/>

                <div className="font-medium! text-[24px]! mx-auto! pt-4!">
                    Sign up to Messenger
                </div>
                <div className="text-[16px]! mx-auto! max-w-60 text-center text-[#959595]">
                    Please enter username, email and password
                </div>

                <div className="flex flex-col w-full gap-6 px-4! pt-6!">
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => handleFieldChanged("username", e.target.value, setUsername)}
                            placeholder=" "
                            className={`
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]!
                                px-4! peer transition-all duration-200
                                ${fieldErrors.username 
                                    ? "ring-red-500 group-hover:ring-red-500 group-focus-within:ring-red-500 group-focus-within:ring-2!"
                                    : "ring-white/10 group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]! group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]! group-focus-within:ring-2!"
                                }
                            `}
                        />
                        <label 
                            htmlFor="username" 
                            className={`
                                absolute left-4 origin-left transform group-focus-within:-translate-y-6 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#171717] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-6 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#171717]
                                ${fieldErrors.username
                                    ? "text-red-400 group-hover:text-red-500 group-focus-within:text-red-500"
                                    : "text-[#959595] group-hover:text-[#527AFF] group-focus-within:text-[#527AFF]"
                                }
                            `}
                        >
                            Username
                        </label>
                    </div>
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => handleFieldChanged("email", e.target.value, setEmail)}
                            placeholder=" "
                            className={`
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]!
                                px-4! peer transition-all duration-200
                                ${fieldErrors.email
                                    ? "ring-red-500 group-hover:ring-red-500 group-focus-within:ring-red-500 group-focus-within:ring-2!"
                                    : "ring-white/10 group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]! group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]! group-focus-within:ring-2!"
                                }
                            `}
                        />
                        <label 
                            htmlFor="email" 
                            className={`
                                absolute left-4 origin-left transform group-focus-within:-translate-y-6 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#171717] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-6 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#171717]
                                ${fieldErrors.email
                                    ? "text-red-400 group-hover:text-red-500 group-focus-within:text-red-500"
                                    : "text-[#959595] group-hover:text-[#527AFF] group-focus-within:text-[#527AFF]"
                                }
                            `}
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => handleFieldChanged("password", e.target.value, setPassword)}
                            placeholder=" "
                            className={`
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]!
                                pl-4! pr-12! peer transition-all duration-200
                                ${fieldErrors.password
                                    ? "ring-red-500 group-hover:ring-red-500 group-focus-within:ring-red-500 group-focus-within:ring-2!"
                                    : "ring-white/10 group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]! group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]! group-focus-within:ring-2!"
                                }
                            `}
                        />
                        <label 
                            htmlFor="password" 
                            className={`
                                absolute left-4 origin-left transform group-focus-within:-translate-y-6 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#171717] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-6 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#171717]
                                ${fieldErrors.password
                                    ? "text-red-400 group-hover:text-red-500 group-focus-within:text-red-500"
                                    : "text-[#959595] group-hover:text-[#527AFF] group-focus-within:text-[#527AFF]"
                                }
                            `}
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className={`
                                absolute right-4 text-[#959595]! cursor-pointer transition-[opacity, colors] duration-200
                                ${fieldErrors.password
                                    ? "group-hover:text-red-500! hover:text-red-500! group-focus-within:text-red-500!"
                                    : "group-hover:text-[#527AFF]! hover:text-[#2E5FFF]! group-focus-within:text-[#527AFF]!"
                                }
                            `}
                        >
                            <div className={`transition-transform duration-300 ease-in-out ${showPassword ? "scale-110" : "scale-90"}`}>
                                {showPassword === true ? (<Eye/>) : (<EyeClosed/>)}
                            </div>
                        </button>
                    </div>
                    <div className="relative flex items-center justify-center w-full group">
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                handleFieldChanged("confirmPassword", e.target.value, setConfirmPassword);
                                setError("");
                            }}
                            placeholder=" "
                            autoComplete="new-password"
                            className={`
                                h-12 w-full rounded-2xl outline-none! ring-[1.5px]!
                                pl-4! pr-12! peer transition-all duration-200
                                ${fieldErrors.confirmPassword
                                    ? "ring-red-500 group-hover:ring-red-500 group-focus-within:ring-red-500 group-focus-within:ring-2!"
                                    : "ring-white/10 group-hover:ring-[#527AFF] group-hover:placeholder-[#527AFF]! group-focus-within:ring-[#527AFF] group-focus-within:placeholder-[#527AFF]! group-focus-within:ring-2!"
                                }
                            `}
                        />
                        <label 
                            htmlFor="confirmPassword" 
                            className={`
                                absolute left-4 origin-left transform group-focus-within:-translate-y-6 group-focus-within:-translate-x-2
                                group-focus-within:text-xs! group-focus-within:bg-[#171717] group-focus-within:px-1! group-focus-within:font-medium!
                                duration-200 cursor-text not-peer-placeholder-shown:-translate-y-6 not-peer-placeholder-shown:-translate-x-2
                                not-peer-placeholder-shown:text-xs! not-peer-placeholder-shown:px-1! not-peer-placeholder-shown:bg-[#171717]
                                ${fieldErrors.confirmPassword
                                    ? "text-red-400 group-hover:text-red-500 group-focus-within:text-red-500"
                                    : "text-[#959595] group-hover:text-[#527AFF] group-focus-within:text-[#527AFF]"
                                }
                            `}
                        >
                            Confirm password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className={`
                                absolute right-4 cursor-pointer transition-[opacity, colors] duration-200 text-[#959595]!
                                ${fieldErrors.confirmPassword
                                    ? "group-hover:text-red-500! hover:text-red-500! group-focus-within:text-red-500!"
                                    : "group-hover:text-[#527AFF]! hover:text-[#2E5FFF]! group-focus-within:text-[#527AFF]!"
                                }
                            `}
                        >
                            <div className={`transition-transform duration-300 ease-in-out ${showConfirmPassword ? "scale-110" : "scale-90"}`}>
                                {showConfirmPassword === true ? (<Eye/>) : (<EyeClosed/>)}
                            </div>
                        </button>
                    </div>

                    <div className="relative flex items-center">
                        {(error || getFirstError(fieldErrors)) && (
                            <p 
                                className="absolute text-red-400 text-[15px]!" 
                                role="alert"
                                aria-live="polite"
                            >
                                {error || getFirstError(fieldErrors)}
                            </p>
                        )}
                    </div>

                    <div className="relative flex items-center justify-center w-full group">
                        <button 
                            type="submit"
                            className="h-12 w-full rounded-2xl bg-[#527AFF]! cursor-pointer text-lg! font-bold! hover:bg-[#2E5FFF]! transition-all duration-200"
                        >
                            Register
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-end pr-3! pt-3!">
                    <span className="text-[#959595] text-[15px]! pr-1!">
                        Have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="flex text-[#527AFF]! hover:text-[#2E5FFF]! hover:underline transition-colors duration-300 cursor-pointer"
                    >
                        <span className="text-[15px]!">Log in</span>
                        <ChevronRight className="size-5.5!"/>
                    </button>
                </div>
            </form>
        </div>
    );
}
