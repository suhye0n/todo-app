import React, { useState } from "react";
import { TextField, Paper, Button, Grid, Select, MenuItem } from "@material-ui/core";

function AddTodo({ add }) {
    const today = new Date().toISOString().split('T')[0];

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
        <Paper style={{ margin: 16, padding: 16 }}>
            <Grid container spacing={1}>
                <Grid item xs={6} md={6}>
                    <TextField
                        name="title"
                        placeholder="Add Todo here"
                        fullWidth
                        onChange={onInputChange}
                        value={item.title}
                        onKeyPress={enterKeyEventHandler}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <TextField
                        name="deadline"
                        type="date"
                        fullWidth
                        onChange={onInputChange}
                        value={item.deadline}
                    />
                </Grid>
                <Grid item xs={2} md={2}>
                    <Select
                        name="importance"
                        fullWidth
                        value={item.importance}
                        onChange={onInputChange}
                    >
                        <MenuItem value="x">-- 중요도 --</MenuItem>
                        <MenuItem value="상">상</MenuItem>
                        <MenuItem value="중">중</MenuItem>
                        <MenuItem value="하">하</MenuItem>
                    </Select>
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
        </Paper>
    );
}

export default AddTodo;
