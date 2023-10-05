import React, { useEffect, useState } from "react";
import { Button, TextField, Link, Grid, Container, Typography, AppBar, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { signup } from "./service/ApiService";
import styled from "styled-components";
import { useDarkMode } from "./DarkModeContext";
import emailjs from 'emailjs-com';

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

function SignUp() {
    const { darkMode, setDarkMode } = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [inputVerificationCode, setInputVerificationCode] = useState('');
    const [showVerificationInput, setShowVerificationInput] = useState(false);

    const sendEmailVerificationCode = (email) => {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const templateParams = {
            to_email: email,
            to_name: email.split('@')[0],
            verification_code: verificationCode
        };

        emailjs.send('service_6ivehyn', 'template_gu4akws', templateParams, '3YYSEIx_1W94_6PHN')
            .then((response) => {
                alert('인증코드를 전송했습니다. 메일함을 확인해주세요.');
                console.log('인증코드 전송 성공!', response.status, response.text);
                localStorage.setItem('verificationCode', verificationCode);
                setShowVerificationInput(true);
            }, (error) => {
                console.log('Failed...', error);
            });
    };

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
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");
        const storedVerificationCode = localStorage.getItem('verificationCode');

        if (inputVerificationCode !== storedVerificationCode) {
            alert("이메일 인증을 받아주세요.");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await signup({ email, username, password })
        } catch (error) {
            alert("회원가입에 실패했습니다.");
        }
    };

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
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" style={{ marginTop: 120, marginBottom: "8%" }}>
                                🧑계정 생성
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField
                                darkMode={darkMode}
                                autoComplete="username"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="사용자 이름🧑"
                                autoFocus
                            />
                        </Grid>
                        <Grid container spacing={1} alignItems="center" style={{ width: 'calc(100% - 10px)', marginLeft: '4px', marginTop: '5px' }}>
                            <Grid item xs={8}>
                                <StyledTextField
                                    darkMode={darkMode}
                                    autoComplete="email"
                                    name="email"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일 주소📧"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    style={{ height: '52px' }}
                                    onClick={() => {
                                        const email = document.getElementById("email").value;
                                        sendEmailVerificationCode(email);
                                    }}
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                >
                                    인증코드 전송
                                </Button>
                            </Grid>
                        </Grid>
                        {showVerificationInput && (
                            <>
                                <Grid container spacing={1} alignItems="center" style={{ width: 'calc(100% - 10px)', marginLeft: '4px', marginTop: '10px' }}>
                                    <Grid item xs={8}>
                                        <StyledTextField
                                            darkMode={darkMode}
                                            autoComplete="verification-code"
                                            name="inputVerificationCode"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="inputVerificationCode"
                                            label="인증 코드 입력"
                                            value={inputVerificationCode}
                                            onChange={e => setInputVerificationCode(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            style={{ height: '52px' }}
                                            onClick={() => {
                                                const storedVerificationCode = localStorage.getItem('verificationCode');
                                                if (inputVerificationCode !== storedVerificationCode) {
                                                    alert("인증 코드가 일치하지 않습니다.");
                                                } else {
                                                    alert("인증 코드가 확인되었습니다!");
                                                }
                                            }}
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                        >
                                            확인
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <StyledTextField
                                style={{ marginTop: '5px' }}
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
                            <StyledTextField
                                darkMode={darkMode}
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="confirm-password"
                                name="confirmPassword"
                                variant="outlined"
                                required
                                fullWidth
                                id="confirmPassword"
                                label="비밀번호 확인🔒"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleConfirmPasswordVisibility}>
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
                                계정생성
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                <Grid item style={{ padding: "20px 3px" }}>이미 계정이 있습니까? 여기서 로그인 하세요🖱️</Grid>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    );
}

export default SignUp;
