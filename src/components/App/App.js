import React, { Component } from 'react';
import { Menu } from 'antd';
import clsx from 'clsx';
import MoviesList from '../MoviesList/MoviesList';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';

export default class App extends Component {
  state = {
    isError: false,
    current: 'search',
  };

  onError = () => {
    this.setState({ isError: true });
  };

  render() {
    const { isError, current } = this.state;
    const errorMessage = isError ? <ErrorIndicator /> : null;

    return (
      <div className="page">
        {errorMessage}
        <Menu className={clsx({ hidden: isError })} mode="horizontal" selectedKeys={[current]}>
          <Menu.Item key="search">Search</Menu.Item>
          <Menu.Item key="rated">Rated</Menu.Item>
        </Menu>
        <MoviesList onError={this.onError} />
      </div>
    );
  }
}
