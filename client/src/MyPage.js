import React, { useEffect } from "react";
import { Button, TextField, Link, Container, Grid, AppBar, Toolbar, Typography, Divider } from "@material-ui/core";
import { update, withdrawal, signout } from "./service/ApiService";
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575
  }
`;

function MyPage() {
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");

        update({ email: email, username: username, password: password }).then(
            (response) => {
                alert('회원 정보 수정이 완료되었습니다.');
                window.location.href = "/login";
            }
        );
    };

    const handleWithdrawal = async () => {
        const emailInput = prompt('정말 탈퇴하시려면 이메일을 입력해주세요😢');
        const password = prompt('정말 탈퇴하시려면 비밀번호를 입력해주세요😢');
    
        const storedEmail = localStorage.getItem("email");
    
        if (emailInput !== storedEmail) {
            alert("입력하신 이메일이 올바르지 않습니다.");
            return;
        }
    
        if (emailInput && password) {
            try {
                await withdrawal({ email: emailInput, password: password });
                alert('회원 탈퇴가 완료되었습니다.');
                window.location.href = "/login";
            } catch (error) {
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            alert("회원 탈퇴를 취소하였습니다.");
        }
    };    

    const navigationBar = (
        <StyledAppBar position="static">
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6" onClick={() => window.location.href = '/'} style={{ cursor: "pointer" }}>✍오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={() => window.location.href = '/mypage'}>🧍마이페이지</Button>
                        <Button color="inherit" onClick={signout}>👋로그아웃</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </StyledAppBar>
    );

    useEffect(() => {
        const accessToken = localStorage.getItem('ACCESS_TOKEN');
        
        if (!accessToken) {
            window.location.href = "/login";
            return;
        }
    }, []);

    return (
        <>
            {navigationBar}
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                🧍마이페이지
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
                                label="사용자 이름"
                                defaultValue={localStorage.getItem("username")}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                id="email"
                                label="이메일 주소 (수정할 수 없어요)"
                                defaultValue={localStorage.getItem("email")}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="current-password"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="비밀번호"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                수정
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Divider variant="middle" style={{ margin: "1rem 0" }}/>

                <Typography variant="h6" align="center">
                    😢회원 탈퇴
                </Typography>
                <Typography 
                    align="center" 
                    onClick={handleWithdrawal}
                >
                    <Link style={{ cursor: "pointer" }}>회원 탈퇴하시려면 여기를 클릭해주세요🖱️</Link>
                </Typography>
                
            </Container>
        </>
    );
};

export default MyPage;