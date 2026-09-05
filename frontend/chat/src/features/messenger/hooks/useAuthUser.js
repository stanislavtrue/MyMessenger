import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react"

export const useAuthUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await apiFetch("http://localhost:5079/api/auth/me");

                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }

                const user = await response.json();

                setCurrentUser({
                    id: user.id,
                    displayName: user.displayName,
                    username: user.username,
                    avatar: user.avatarUrl,
                    isOnline: user.isOnline,
                    lastSeenAt: user.lastSeenAt
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingUser(false);
            }
        };

        getCurrentUser();
    }, []);

    return { currentUser, isLoadingUser };
};
