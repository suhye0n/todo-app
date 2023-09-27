import React, { useState, useEffect } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { Paper, List, Container } from "@material-ui/core";
import './App.css';
import { call } from './service/ApiService';

function App() {
  const [items, setItems] = useState([]);

  const add = (item) => {
    call("/todo", "POST", item).then((response) =>
      setItems(response.data)
    );
  };

  const deleteItem = (item) => {
    call("/todo", "DELETE", item).then((response) =>
      setItems(response.data)
    );
  };

  const update = (item) => {
    call("/todo", "PUT", item).then((response) =>
      setItems(response.data)
    );
  };

  useEffect(() => {
    call("/todo", "GET", null).then((response) =>
      setItems(response.data)
    );
  }, []);

  const todoItems = items.length > 0 && (
    <Paper style={{ margin: 16 }}>
      <List>
        {items.map((item) => (
          <Todo item={item} key={item.id} delete={deleteItem} update={update} />
        ))}
      </List>
    </Paper>
  );

  return (
    <div className='App'>
      <Container maxWidth='md'>
        <AddTodo add={add} />
        <div className='TodoList'>{todoItems}</div>
      </Container>
    </div>
  );
}

export default App;
