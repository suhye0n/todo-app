import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import DeleteTodo from './DeleteTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography } from "@material-ui/core";
import './App.css';
import { call, signout } from './service/ApiService';
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575
  }
`;

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const add = (item) => {
        call("/todo", "POST", item).then((response) =>
            setItems(response.data)
        );
    }

    const deleteItem = (item) => {
        call("/todo", "DELETE", item).then((response) =>
            setItems(response.data)
        );
    }

    const update = (item) => {
        call("/todo", "PUT", item).then((response) =>
            setItems(response.data)
        );
    }

    const deleteForCompleted = () => {
        items.forEach(e => {
            if (e.done) {
                call("/todo", "DELETE", e).then((response) =>
                    setItems(response.data)
                );
            }
        });
    }

    useEffect(() => {
        call("/todo", "GET", null).then((response) => {
            setItems(response.data);
            setLoading(false);
        });
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    
    const todoItems = items.length > 0 && (
        <Paper style={{ margin: 16 }}>
            <List>
                {items.map((item) => (
                    <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                ))}
            </List>
        </Paper>
    );
    
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const navigationBar = (
        <StyledAppBar position="static">
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6">오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="inherit">마이페이지</Button>
                        <Button color="inherit" onClick={signout}>로그아웃</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </StyledAppBar>
    );

    return (
        <div className="App">
            {loading ? (
                <h1>로딩중..</h1>
            ) : (
                <div>
                    {navigationBar}
                    <Container maxWidth="md">
                        <AddTodo add={add} />
                        <div className="TodoList">
                            <Paper style={{ margin: 16 }}>
                                <List>
                                    {currentItems.map((item) => (
                                        <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                                    ))}
                                </List>
                            </Paper>
                            <div>
                                {pageNumbers.map(num => (
                                    <Button key={num} onClick={() => setCurrentPage(num)}>
                                        {num}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Container>
                    <DeleteTodo deleteForCompleted={deleteForCompleted} />
                </div>
            )}
        </div>
    );
}

export default App;
