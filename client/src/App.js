import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import DeleteTodo from './DeleteTodo';
import { useDarkMode } from "./DarkModeContext";
import { Select, MenuItem, Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, InputBase } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/Search';
import './App.css';
import { call, signout } from './service/ApiService';
import styled from "styled-components";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic3VoeWUwbiIsImEiOiJjbG4ycGNnNDEwYzJnMmtucmU0cHl5YTQzIn0.DJ559UUk37apuQv0jZdWMw' });

const StyledPaper = styled(Paper)`
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
`;

const StyledAppBar = styled(AppBar)`
  && {
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};
    position: fixed;
    top: 0;
  }
`;

const StyledSelect = styled(Select)`
  && {
    display: block;
    width: 100px;
    margin-left: 30px;
    padding: 0 30px 0 10px;
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};

    ul {
      background-color: #333 !important;
    }

    &:hover {
      background-color: ${({ darkMode }) => darkMode ? "#444" : "#e0e0e0"};
    }
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
        background-color: ${({ darkMode }) => darkMode ? "#444" : "#fff"};
        color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};
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

    &:hover {
        background-color: ${({ darkMode }) => darkMode ? "#444" : "#e0e0e0"};
    }

    &.active {
        background-color: ${({ darkMode }) => darkMode ? "#444" : "#bdbdbd"};
    }
  }
`;

const PagingContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const PagingButton = styled(Button)`
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#fff" : "#757575"};

    &:hover {
        background-color: ${({ darkMode }) => darkMode ? "#444" : "#e0e0e0"};
    }

    &.active {
        background-color: ${({ darkMode }) => darkMode ? "#444" : "#bdbdbd"};
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
    const { darkMode, setDarkMode } = useDarkMode();
    const [prevProgress, setPrevProgress] = useState(0);
    const API_KEY = '3b0dad37b0a95472e4183882ade8a4b5'

    const add = (item) => {
        const currentTotalItems = items.length;
        call("/todo", "POST", item).then((response) => {
            setSortOrder('기본순');
            setItems(response.data);
            
            if (currentTotalItems % 5 === 0) {
                setCurrentPage(totalPages + 1);
            } else {
                setCurrentPage(totalPages);
            }
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
        <StyledAppBar position="static" darkMode={darkMode}>
            <Toolbar>
                <Grid justifyContent="space-between" container>
                    <Grid item>
                        <Typography variant="h6">✍오늘의 할일</Typography>
                    </Grid>
                    <Grid item>
                        <SearchContainer>
                            <StyledInputBase
                                darkMode={darkMode}
                                placeholder="검색할 투두 제목 입력 🤔"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <StyledSearchIcon />
                        </SearchContainer>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? "☀️ 라이트모드" : "🌙 다크모드"}
                        </Button>
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

                        <div className="TodoList">
                            <StyledPaper style={{ margin: 16 }} darkMode={darkMode}>
                                <div style={{ margin: "20px 0" }}>
                                    <LinearProgress variant="determinate" value={calculateProgress()} />
                                    <Typography variant="body1" align="center">
                                        {Math.round(calculateProgress())}%
                                    </Typography>
                                </div>

                                <StyledSelect
                                    value={sortOrder}
                                    onChange={(e) => {
                                        setSortOrder(e.target.value);
                                        const sortedData = sortData(items);
                                        setItems(sortedData);
                                    }}
                                    darkMode={darkMode}
                                >
                                    <StyledMenuItem value="기본순" darkMode={darkMode}>기본순</StyledMenuItem>
                                    <StyledMenuItem value="중요순" darkMode={darkMode}>중요순</StyledMenuItem>
                                    <StyledMenuItem value="제목순" darkMode={darkMode}>제목순</StyledMenuItem>
                                    <StyledMenuItem value="마감일순" darkMode={darkMode}>마감일순</StyledMenuItem>
                                </StyledSelect>

                                <List>
                                    {currentItems.map((item) => (
                                        <Todo item={item} key={item.id} delete={deleteItem} update={update} />
                                    ))}
                                </List>
                            </StyledPaper>
                            
                            <DeleteTodo deleteForCompleted={deleteForCompleted} />

                            <PagingContainer>
                                <PagingButton darkMode={darkMode} onClick={() => setCurrentPage(firstPages)}>«</PagingButton>
                                <PagingButton darkMode={darkMode} onClick={prevPage}>‹</PagingButton>
                                {pageNumbers.map(num => (
                                    num === currentPage ? (
                                        <ActiveButton key={num} darkMode={darkMode} onClick={() => setCurrentPage(num)}>
                                            {num}
                                        </ActiveButton>
                                    ) : (
                                        <PagingButton key={num} darkMode={darkMode} onClick={() => setCurrentPage(num)}>
                                            {num}
                                        </PagingButton>
                                    )
                                ))}
                                <PagingButton darkMode={darkMode} onClick={nextPage}>›</PagingButton>
                                <PagingButton darkMode={darkMode} onClick={() => setCurrentPage(totalPages)}>››</PagingButton>
                            </PagingContainer>
                        </div>
                    </Container>
                </div>
            )}
        </div>
    );
}

export default App;
