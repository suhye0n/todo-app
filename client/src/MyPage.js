import React from "react";
import {
    Button,
    TextField,
    Link,
    Grid,
    Container,
    Typography,
} from "@material-ui/core";
import { infoedit, withdrawal } from "./service/ApiService"; 

function MyPage() {
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");

        infoedit({ email: email, username: username, password: password }).then(
            (response) => {
                window.location.href = "/login";
            }
        );
    };

    const handleWithdrawal = () => {
        const email = prompt('정말 탈퇴하시려면 이메일을 입력해주세요');
        const password = prompt('비밀번호를 입력해주세요');

        if (email && password) {
            withdrawal({ email: email, password: password }).then(
                (response) => {
                    window.location.href = "/login"; 
                }
            );
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            사용자 정보 수정
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
                            label="수정 할 이름 입력"
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
                            label="내 이메일(아이디)"
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
                            label="수정 할 패스워드 입력"
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
                            수정 완료
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end">
                </Grid>
            </form>

            <Typography 
                variant="h6" 
                style={{marginTop: '20px', cursor: 'pointer'}} 
                onClick={handleWithdrawal}
            >
                회원 탈퇴
            </Typography>
        </Container>
    );
};

export default MyPage;