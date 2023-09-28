import React, { useEffect } from "react";
import { Button, TextField, Link, Grid, Container, Typography, AppBar, Toolbar } from "@material-ui/core";
import { signup } from "./service/ApiService";
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575
  }
`;

function SignUp() {
    const navigationBar = (
        <StyledAppBar position="static">
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6" onClick={() => window.location.href = '/'} style={{ cursor: "pointer" }}>✍오늘의 할일</Typography>
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

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await signup({ email, username, password })
        } catch (error) {
            alert("회원가입에 실패하였습니다.");
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
                            <Typography component="h1" variant="h5" style={{ marginBottom: "8%" }}>
                                🧑계정 생성
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
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
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="이메일 주소📧"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                autoComplete="current-password"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="비밀번호🔒"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                autoComplete="confirm-password"
                                name="confirmPassword"
                                variant="outlined"
                                required
                                fullWidth
                                id="confirmPassword"
                                label="비밀번호 확인🔒"
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
