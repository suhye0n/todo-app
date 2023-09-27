import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography } from "@material-ui/core";
import './App.css';
import { call, signout } from './service/ApiService';

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const add = (item) => {
        call("/todo", "POST", item).then(response => setItems(response.data));
    };

    const deleteItem = (item) => {
        call("/todo", "DELETE", item).then(response => setItems(response.data));
    };

    const update = (item) => {
        call("/todo", "PUT", item).then(response => setItems(response.data));
    };

    useEffect(() => {
        call("/todo", "GET", null).then(response => {
            setItems(response.data);
            setLoading(false);
        });
    }, []);

    const todoItems = items.length > 0 && (
        <Paper style={{ margin: 16 }}>
            <List>
                {items.map((item, idx) => (
                    <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                ))}
            </List>
        </Paper>
    );

    const navigationBar = (
        <AppBar position="static">
            <Toolbar>
                <Grid justify="space-between" container>
                    <Grid item>
                        <Typography variant="h6">오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={signout}>logout</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );

    const todoListPage = (
        <div>
            {navigationBar}
            <Container maxWidth="md">
                <AddTodo add={add} />
                <div className="TodoList">{todoItems}</div>
            </Container>
        </div>
    );

    const content = loading ? <h1>로딩중..</h1> : todoListPage;

    return (
        <div className="App">
            {content}
        </div>
    );
}

export default App;
