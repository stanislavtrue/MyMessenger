import { refreshAccessToken } from "./auth";

let refreshPromise = null;

const redirectToLogin = () => {
    localStorage.removeItem("accessToken");

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
};

export const apiFetch = async (url, options = {}) => {
    const sendRequest = (token) =>
        fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`
            }
        });

    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        redirectToLogin();
        return null;
    }

    let response = await sendRequest(accessToken);

    if (response.status !== 401) {
        return response;
    }

    if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
            .finally(() => {
                refreshPromise = null;
            });
    }

    accessToken = await refreshPromise;

    if (!accessToken) {
        redirectToLogin();
        return null;
    }

    response = await sendRequest(accessToken);

    if (response.status === 401) {
        redirectToLogin();
        return null;
    }

    return response;
};
