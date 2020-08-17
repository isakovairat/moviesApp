import React from 'react';
import { Input } from 'antd';
import MoviesList from '../MoviesList/MoviesList';

const App = () => {
  return (
    <div className="page">
      <Input placeholder="Type to search..." className="input" />
      <MoviesList />
    </div>
  );
};

export default App;
