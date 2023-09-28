import { API_BASE_URL } from "../app-config";

const ACCESS_TOKEN = "ACCESS_TOKEN";
const username = "username";
const email = "email";

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

export const signin = async userDTO => {
    const response = await call("/auth/signin", "POST", userDTO);

    if (response.token) {
        localStorage.setItem(ACCESS_TOKEN, response.token);
        localStorage.setItem(username, response.username);
        localStorage.setItem(email, userDTO.email);
        window.location.href = "/";
    }
}

export const signup = async userDTO => {
    try {
        const response = await call("/auth/signup", "POST", userDTO);

        if (response.id) {
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Oops!", error.status, "Ooops!");

        if (error.status === 403) {
            window.location.href = "/auth/signup";
        }

        throw error;
    }
}

export const signout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(username);
    localStorage.removeItem(email);
    alert("로그아웃이 완료되었습니다.");
    window.location.href = "/";
}

export const update = async userDTO => {
    try {
        const response = await call("/auth/update", "POST", userDTO);

        if (response.status === 200) {
            window.location.href ="/";
        }
    } catch (error) {
        console.error(error.status);
    }
}

export const withdrawal = async userDTO => {
    try {
        const response = await call("/auth/withdrawal", "DELETE", userDTO);

        if (response.status === 200) {
            signout();
        }
    } catch (error) {
        console.error(error.status);
        alert("회원 탈퇴를 실패하였습니다.");

        if (error.status === 403) {
            window.location.href = "/login";
        }

        throw error;
    }
}
