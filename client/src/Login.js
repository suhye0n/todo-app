import React, { useEffect, useState  } from "react";
import { signin } from "./service/ApiService";
import { Button, TextField, Grid, Link, Container, Typography, AppBar, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import styled from "styled-components";
import { useDarkMode } from "./DarkModeContext";

const StyledAppBar = styled(AppBar)`
    && {
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};
    position: fixed;
    top: 0;
    }
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      fieldset {
        border-color: ${({ darkMode }) => darkMode ? "#aaa" : "#e0e0e0"};
      }
      &:hover fieldset {
        border-color: ${({ darkMode }) => darkMode ? "#fff" : "#bdbdbd"};
      }
      &.Mui-focused fieldset {
        border-color: ${({ darkMode }) => darkMode ? "#fff" : "#9e9e9e"};
      }
    }

    .MuiFormLabel-root {
      color: ${({ darkMode }) => darkMode ? "#aaa" : "#9e9e9e"};
      &.Mui-focused {
        color: ${({ darkMode }) => darkMode ? "#fff" : "#9e9e9e"};
      }
    }

    .MuiInputBase-input {
      color: ${({ darkMode }) => darkMode ? "#fff" : "#333"};
    }

    .MuiInputBase-input::placeholder {
        color: ${({ darkMode }) => darkMode ? "#fff" : "#333"};
    }
  }
`;

function Login() {
    const { darkMode, setDarkMode } = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const navigationBar = (
        <StyledAppBar darkMode={darkMode} position="static">
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6" onClick={() => window.location.href = '/'} style={{ cursor: "pointer" }}>✍오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? "☀️ 라이트모드" : "🌙 다크모드"}
                        </Button>
                        <Button color="inherit" onClick={() => window.location.href = '/login'}>🧍로그인</Button>
                        <Button color="inherit" onClick={() => window.location.href = '/signup'}>🧍회원가입</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </StyledAppBar>
    );
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get("email");
        const password = data.get("password");

        try {
            await signin({ email, password });
        } catch (error) {
            alert("로그인에 실패하였습니다.");
        }
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('ACCESS_TOKEN');
        
        if (accessToken) {
            window.location.href = "/";
            return;
        }
    }, [])

    return (
        <>
            {navigationBar}
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <Grid container spacing={2}>
                    <Typography component="h1" variant="h5" style={{ marginTop: 120, marginBottom: "8%", paddingLeft: "10px" }}>
                        🙌로그인
                    </Typography>
                </Grid>
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StyledTextField
                                darkMode={darkMode}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="이메일 주소📧"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField
                                darkMode={darkMode}
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="비밀번호🔒"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handlePasswordVisibility}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                로그인
                            </Button>
                        </Grid>
                        <Link href="/signup" variant="body2">
                            <Grid item style={{ padding: "10px" }}>계정이 없습니까? 여기서 가입하세요🖱️</Grid>
                        </Link>
                    </Grid>
                </form>
            </Container>
        </>
    );
}

export default Login;
