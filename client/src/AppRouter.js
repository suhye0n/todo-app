import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright ⓒ "}
            suhye0n, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<App />} />
                </Routes>
            </div>
            <div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </div>
        </BrowserRouter>
    );
}

export default AppRouter;
