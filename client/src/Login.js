import React, { useEffect } from "react";
import { signin } from "./service/ApiService";
import { Button, TextField, Grid, Link, Container, Typography, AppBar, Toolbar } from "@material-ui/core";
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575
  }
`;

function Login() {
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
                    <Typography component="h1" variant="h5" style={{ marginBottom: "8%", paddingLeft: "10px" }}>
                        🙌로그인
                    </Typography>
                </Grid>
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
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
                            <TextField
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="비밀번호🔒"
                                name="password"
                                autoComplete="password"
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
