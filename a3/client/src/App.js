// src/App.js
import React, { useState } from 'react';
import Login from './Login';
import TodoList from './TodoList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
      <div>
        {!isLoggedIn ? (
            <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
            <TodoList />
        )}
      </div>
  );
};

export default App;
