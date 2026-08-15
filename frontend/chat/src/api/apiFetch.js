import { refreshAccessToken } from "./auth";

export const apiFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (response.status !== 401) {
        return response;
    }

    accessToken = await refreshAccessToken();

    if (!accessToken) {
        return response;
    }

    response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response;
};
