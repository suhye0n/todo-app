import { API_BASE_URL } from "../app-config";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export const call = async (api, method, request) => {
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
    }

    const options = {
        headers,
        url: `${API_BASE_URL}${api}`,
        method,
        ...(request && { body: JSON.stringify(request) })
    };

    try {
        const response = await fetch(options.url, options);
        const json = await response.json();

        if (!response.ok) throw json;

        return json;
    } catch (error) {
        console.error("Oops!", error.status, "Ooops!");

        if (error.status === 403) {
            window.location.href = "/login";
        }

        throw error;
    }
}
