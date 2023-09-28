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
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic3VoeWUwbiIsImEiOiJjbG4ycGNnNDEwYzJnMmtucmU0cHl5YTQzIn0.DJ559UUk37apuQv0jZdWMw' });

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #fff;
    color: #757575;
    position: fixed;
    top: 0;
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
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState('기본순');
    const importanceOrder = ["상", "중", "하", "x"];
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [quote, setQuote] = useState(null);
    const [username, setUsername] = useState("");
    const API_KEY = '3b0dad37b0a95472e4183882ade8a4b5'

    const add = (item) => {
        call("/todo", "POST", item).then((response) => {
            setSortOrder('기본순');
            setItems(response.data);
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
                sortedItems.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                break;
            default:
                return sortedItems;
        }

        return sortedItems;
    }
    
    const getWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`);
      
            if (!response.ok) {
                throw new Error("날씨 정보를 가져오는데 실패했습니다.");
            }
      
            const data = await response.json();
            
            const geoResponse = await geocodingClient.reverseGeocode({
                query: [longitude, latitude],
                language: ['ko']
            }).send();
    
            const cityNameInKorean = geoResponse.body.features[0].place_name;
    
            setLocation(cityNameInKorean);
            setWeather(data);
      
        } catch (error) {
            console.error("날씨 정보를 가져오는데 실패했습니다.", error);
        }
    };     

    const translate = async (text) => {
        try {
            const response = await fetch("https://libretranslate.de/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: "en",
                    target: "ko"
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error("Translation failed");
            }
    
            const data = await response.json();
            return data.translatedText;
        } catch (error) {
            console.error("Failed to translate text", error);
            return text;
        }
    };
    
    const getRandomQuote = async () => {
        try {
            const response = await fetch("https://api.quotable.io/random");
    
            if (!response.ok) {
                throw new Error("Failed to fetch quote");
            }
    
            const data = await response.json();
            const translatedContent = await translate(data.content);
            
            setQuote({
                ...data,
                content: translatedContent
            });
    
        } catch (error) {
            console.error("Failed to fetch quote", error);
        }
    };

    const Clock = () => {
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

        let greetingMessage = "";
        const hour = time.getHours();

        if (hour < 12) {
            greetingMessage = `안녕하세요, ${username}님😀🌅`;
        } else if (hour < 18) {
            greetingMessage = `점심은 드셨나요, ${username}님?😊🍱`;
        } else {
            greetingMessage = `오늘 하루도 멋진 하루 되셨나요, ${username}님?🌆`;
        }

        return (
            <div>
                <span>{formattedTime}</span>
                <div style={{fontSize: 20, marginTop: 30}}>{greetingMessage}</div>
            </div>
        );
    };

    useEffect(() => {
        const sortedData = sortData(items);
        setItems(sortedData);
    }, [sortOrder]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            window.location.href = "/login";
            return;
        }
        
        call("/todo", "GET", null).then((response) => {
            setItems(response.data);
            setLoading(false);
        });
        
        navigator.geolocation.getCurrentPosition((position) => {
            getWeather(position.coords.latitude, position.coords.longitude);
        });
        
        getRandomQuote();
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

                    <div style={{ fontSize: 40, marginTop: 120, marginBottom: 50 }}> <Clock /> </div>
                    {weather && (
                        <div>
                            <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="날씨 아이콘" />
                            <p>📌 {location}</p>
                            <p>
                                🌡️ {weather.main.temp}°C,
                                🌤️ {weather.weather[0].description}
                            </p>
                        </div>
                    )}

                    <Container maxWidth="md">
                        {quote && <div style={{marginBottom: 50, color: '#fcb9aa', fontSize: 14, fontStyle: 'italic'}}>"{quote.content}" - {quote.author}</div>}
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
                                    <LinearProgress variant="determinate" value={calculateProgress()} />
                                    <Typography variant="body1" align="center">
                                        {Math.round(calculateProgress())}%
                                    </Typography>
                                </div>

                                <List>
                                    {currentItems.map((item) => (
                                        <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                                    ))}
                                </List>
                            </Paper>
                            
                            <DeleteTodo deleteForCompleted={deleteForCompleted} />
                            
                            <div className="PaginationButtons" style={{marginTop: 30}}>
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
                </div>
            )}
        </div>
    );
}

export default App;
