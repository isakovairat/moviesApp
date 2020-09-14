import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import clsx from 'clsx';
import { GenresConsumer } from '../Genres-context';
import MoviesView from '../MoviesView/MoviesView';

export default class RatedList extends Component {
  static defaultProps = {
    userRated: [],
    onRateChange: () => {},
  };

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    userRated: PropTypes.array,
    onRateChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      totalPages: null,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { userRated } = this.props;
    if (prevProps.userRated !== userRated) {
      this.forceUpdate();
    }
  }

  handlePaginationChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { currentPage, totalPages } = this.state;
    const { onRateChange, userRated } = this.props;

    const content = (
      <GenresConsumer>
        {(genres) => {
          return <MoviesView movies={userRated} genres={genres} handleRateChange={onRateChange} />;
        }}
      </GenresConsumer>
    );

    const pagination = (
      <Pagination
        current={currentPage}
        size="small"
        total={totalPages}
        className={clsx({ pagination: true })}
        hideOnSinglePage
        onChange={this.handlePaginationChange}
      />
    );

    return (
      <section className="movies-list">
        {content}
        {pagination}
      </section>
    );
  }
}
