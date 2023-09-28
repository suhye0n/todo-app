import React from "react";
import {
    Button,
    TextField,
    Link,
    Grid,
    Container,
    Typography,
} from "@material-ui/core";
import { signup } from "./service/ApiService";

function SignUp() {
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

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            계정 생성
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
                            label="이메일 주소"
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
                            label="패스워드"
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
                            label="비밀번호 확인"
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
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            이미 계정이 있습니까? 로그인 하세요.
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default SignUp;
