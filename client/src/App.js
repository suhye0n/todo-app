import React from 'react';
import Todo from './Todo';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          id: 0,
          title: "Todo 1",
          done: false
        }, {
          id: 1,
          title: "Todo 2",
          done: false
        },
      ],
    };
  }

  render() {
    var todoItems = this.state.items.map((item, idx) => (
      <Todo item={item} key={item.id} />
    ))
    return (
      <div className='App'>
        {todoItems}
      </div>
    )
  }
}

export default App;