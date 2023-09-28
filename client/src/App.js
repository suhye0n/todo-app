import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import DeleteTodo from './DeleteTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, InputBase } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import './App.css';
import { call, signout } from './service/ApiService';
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575
  }
`;

const SearchContainer = styled.div`
    position: relative;
    background-color: #f5f5f5;
    border-radius: 10px;
    margin-right: 10px;
    width: 250px;
`;

const StyledInputBase = styled(InputBase)`
    && {
        padding-left: 40px;
        width: 100%;
    }
`;

const StyledSearchIcon = styled(SearchIcon)`
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #757575;
`;

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
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
    const currentItems = items.filter(item => item.title.includes(searchTerm))
        .slice(indexOfFirstItem, indexOfLastItem);

    const totalFilteredItems = items.filter(item => item.title.includes(searchTerm)).length;
    const firstPages = 1;
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

    const pageNumbers = [];

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const navigationBar = (
        <StyledAppBar position="static">
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6">오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <SearchContainer>
                            <StyledInputBase
                                placeholder="Search…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <StyledSearchIcon />
                        </SearchContainer>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={() => window.location.href = '/mypage'}>마이페이지</Button>
                        <Button color="inherit" onClick={signout}>로그아웃</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </StyledAppBar>
    );

    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                            <div className="PaginationButtons">
                                <Button onClick={() => setCurrentPage(firstPages)}>처음 페이지</Button>
                                <Button onClick={prevPage}>이전</Button>
                                {pageNumbers.map(num => (
                                    <Button key={num} onClick={() => setCurrentPage(num)}>
                                        {num}
                                    </Button>
                                ))}
                                <Button onClick={nextPage}>다음</Button>
                                <Button onClick={() => setCurrentPage(totalPages)}>마지막 페이지</Button>
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
