import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import SignUp from "./SignUp";
import MyPage from "./MyPage";
import { DarkModeProvider } from "./DarkModeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center" style={{marginTop: 30, marginBottom: 50}}>
            {"Copyright ⓒ "}
            suhye0n, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <DarkModeProvider>
                <div>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/" element={<App />} />
                    </Routes>
                </div>
                <div>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </div>
            </DarkModeProvider>
        </BrowserRouter>
    );
}

export default AppRouter;
