const hostname = window?.location?.hostname;
console.log("hostname", hostname);

export const API_BASE_URL = hostname === "localhost" ? "http://localhost:8080" : undefined;
