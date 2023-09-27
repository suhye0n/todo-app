import { API_BASE_URL } from "../app-config";

export async function call(api, method, request) {
    const options = {
        headers: {
            "Content-Type": "application/json",
        },
        method: method,
    };

    if (request) {
        options.body = JSON.stringify(request);
    }

    const response = await fetch(API_BASE_URL + api, options);
    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}
