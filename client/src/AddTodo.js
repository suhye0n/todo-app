import React, { useState } from "react";
import { TextField, Paper, Button, Grid } from "@material-ui/core";

function AddTodo({ add }) {
    const [item, setItem] = useState({ title: "" });

    const onInputChange = (e) => {
        setItem({ title: e.target.value });
    };

    const onButtonClick = () => {
        add(item);
        setItem({ title: "" });
    };

    const enterKeyEventHandler = (e) => {
        if (e.key === 'Enter') {
            onButtonClick();
        }
    };

    return (
        <Paper style={{ margin: 16, padding: 16 }}>
            <Grid container>
                <Grid xs={11} md={11} item style={{ paddingRight: 16 }}>
                    <TextField
                        placeholder="Add Todo here"
                        fullWidth
                        onChange={onInputChange}
                        value={item.title}
                        onKeyPress={enterKeyEventHandler}
                    />
                </Grid>
                <Grid xs={1} md={1} item>
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
