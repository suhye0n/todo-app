import React, { useState } from "react";
import { TextField, Paper, Button, Grid, Select, MenuItem } from "@material-ui/core";
import { useDarkMode } from "./DarkModeContext";
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
`;

const StyledTextField = styled(TextField)`
    label.Mui-focused {
        color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
    }

    .MuiOutlinedInput-root {
        fieldset {
            border-color: ${({ darkMode }) => darkMode ? "#888" : "#e0e0e0"};
        }
        
        &:hover fieldset {
            border-color: ${({ darkMode }) => darkMode ? "#aaa" : "#555"};
        }

        &.Mui-focused fieldset {
            border-color: ${({ darkMode }) => darkMode ? "#aaa" : "#555"};
        }
    }

    .MuiInputBase-input {
        color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
    }
`;

const StyledSelect = styled(Select)`
    .MuiInputBase-input {
        color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
    }
`;

function AddTodo({ add }) {
    const today = new Date().toISOString().split('T')[0];
    const { darkMode, setDarkMode } = useDarkMode();
    const [item, setItem] = useState({ title: "", deadline: today, importance: "x" });

    const onInputChange = (e) => {
        setItem(prevItem => ({ ...prevItem, [e.target.name]: e.target.value }));
    };

    const onButtonClick = () => {
        add(item);
        setItem({ title: "", deadline: today, importance: "x" });
    };

    const enterKeyEventHandler = (e) => {
        if (e.key === 'Enter') {
            onButtonClick();
        }
    };

    return (
        <StyledPaper style={{ margin: 16, padding: 16 }} darkMode={darkMode}>
            <Grid container spacing={1}>
                <Grid item xs={6} md={6}>
                    <StyledTextField
                        name="title"
                        placeholder="추가할 투두 제목 입력 😄"
                        fullWidth
                        onChange={onInputChange}
                        value={item.title}
                        onKeyPress={enterKeyEventHandler}
                        darkMode={darkMode}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <StyledTextField
                        name="deadline"
                        type="date"
                        fullWidth
                        onChange={onInputChange}
                        value={item.deadline}
                        darkMode={darkMode}
                    />
                </Grid>
                <Grid item xs={2} md={2}>
                    <StyledSelect
                        name="importance"
                        fullWidth
                        value={item.importance}
                        onChange={onInputChange}
                        darkMode={darkMode}
                    >
                        <MenuItem value="x">-- 중요도 --</MenuItem>
                        <MenuItem value="상">상</MenuItem>
                        <MenuItem value="중">중</MenuItem>
                        <MenuItem value="하">하</MenuItem>
                    </StyledSelect>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Button
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        onClick={onButtonClick}
                    >
                        +
                    </Button>
                </Grid>
            </Grid>
        </StyledPaper>
    );
}

export default AddTodo;
