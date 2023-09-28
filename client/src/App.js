import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import DeleteTodo from './DeleteTodo';
import { Select, MenuItem, Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, InputBase } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
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

const StyledSelect = styled(Select)`
  && {
    padding: 0 30px 0 10px;
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

const ActiveButton = styled(Button)`
  && {
    background-color: #f5f5f5;
  }
`;

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState('기본순');
    const importanceOrder = ["상", "중", "하", "x"];
    const itemsPerPage = 5;

    const add = (item) => {
        call("/todo", "POST", item).then((response) => {
            const sortedData = sortData(response.data);
            setItems(sortedData);
            setCurrentPage(totalPages);
        });
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

    const calculateProgress = () => {
        const completedTasks = items.filter(item => item.done).length;
        const totalTasks = items.length;
        return (completedTasks / totalTasks) * 100;
    }
    
    const sortData = (data) => {
        let sortedItems = [...data];
    
        switch (sortOrder) {
            case "기본순":
                return sortedItems;  
            case "중요순":
                sortedItems.sort((a, b) => importanceOrder.indexOf(a.importance) - importanceOrder.indexOf(b.importance));
                break;
            case "제목순":
                sortedItems.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "마감일순":
                sortedItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                break;
            default:
                return sortedItems;
        }
    
        return sortedItems;
    }

    function Clock() {
        const [time, setTime] = useState(new Date());
    
        useEffect(() => {
            const intervalId = setInterval(() => {
                setTime(new Date());
            }, 1000);
    
            return () => {
                clearInterval(intervalId);
            };
        }, []);
    
        const formattedTime = time.toLocaleTimeString();
    
        return <span>{formattedTime}</span>;
    }

    useEffect(() => {
        const sortedData = sortData(items);
        setItems(sortedData);
    }, [sortOrder, items]);    

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
                        <Typography variant="h6">✍오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <SearchContainer>
                            <StyledInputBase
                                placeholder="검색할 투두 제목 입력 🤔"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <StyledSearchIcon />
                        </SearchContainer>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={() => window.location.href = '/mypage'}>🧍마이페이지</Button>
                        <Button color="inherit" onClick={signout}>👋로그아웃</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </StyledAppBar>
    );

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }    

    return (
        <div className="App">
            {loading ? (
                <h1>로딩중..</h1>
            ) : (
                <div>
                    {navigationBar}

                    <div style={{ fontSize: 30, marginTop: 80, marginBottom: 50 }}> <Clock /> </div>

                    <Container maxWidth="md">
                        <AddTodo add={add} />
                        <StyledSelect
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                const sortedData = sortData(items);
                                setItems(sortedData);
                            }}
                        >
                            <MenuItem value="기본순">기본순</MenuItem>
                            <MenuItem value="중요순">중요순</MenuItem>
                            <MenuItem value="제목순">제목순</MenuItem>
                            <MenuItem value="마감일순">마감일순</MenuItem>
                        </StyledSelect>

                        <div className="TodoList">
                            <Paper style={{ margin: 16 }}>
                                <div style={{ margin: "20px 0" }}>
                                    <Typography variant="body1" align="center">
                                        진행도: {Math.round(calculateProgress())}%
                                    </Typography>
                                    <LinearProgress variant="determinate" value={calculateProgress()} />
                                </div>

                                <List>
                                    {currentItems.map((item) => (
                                        <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                                    ))}
                                </List>
                            </Paper>
                            <div className="PaginationButtons">
                                <Button onClick={() => setCurrentPage(firstPages)}>«</Button>
                                <Button onClick={prevPage}>‹</Button>
                                {pageNumbers.map(num => (
                                    num === currentPage ? (
                                        <ActiveButton key={num} onClick={() => setCurrentPage(num)}>
                                            {num}
                                        </ActiveButton>
                                    ) : (
                                        <Button key={num} onClick={() => setCurrentPage(num)}>
                                            {num}
                                        </Button>
                                    )
                                ))}
                                <Button onClick={nextPage}>›</Button>
                                <Button onClick={() => setCurrentPage(totalPages)}>››</Button>
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
