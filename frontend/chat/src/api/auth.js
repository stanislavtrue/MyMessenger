export const refreshAccessToken = async () => {
    const response = await fetch("http://localhost:5079/api/auth/refresh", {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);

    return data.accessToken;
};
