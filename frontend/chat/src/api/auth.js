export const refreshAccessToken = async () => {
    try {
        const response = await fetch("http://localhost:5079/api/auth/refresh", {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            localStorage.removeItem("accessToken");
            return null;
        }

        const data = await response.json();

        if (!data.accessToken) {
            localStorage.removeItem("accessToken");
            return null;    
        }

        localStorage.setItem("accessToken", data.accessToken);

        return data.accessToken;
    } catch {
        localStorage.removeItem("accessToken");
        return null;
    }
};
