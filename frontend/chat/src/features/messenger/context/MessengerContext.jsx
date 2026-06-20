import { createContext, useContext } from "react";
import { useMessenger } from "../hooks/useMessenger"

const MessengerContext = createContext(null);

export const MessengerProvider = ({ children }) => {
    const messenger = useMessenger();

    return (
        <MessengerContext.Provider value={messenger}>
            {children}
        </MessengerContext.Provider>
    );
}; 

export const useMessengerContext = () => {
    const context = useContext(MessengerContext);

    if (!context) {
        throw new Error(
            "useMessengerContext must be used inside MessengerProvider"
        );
    }

    return context;
}
