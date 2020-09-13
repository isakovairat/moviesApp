import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Alert } from 'antd';
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

    const { userRated } = this.props;

    this.state = {
      currentPage: 1,
      totalPages: null,
      userRated,
      isRated: true,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { userRated } = this.props;
    if (prevProps.userRated !== userRated) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userRated });
    }
  }

  handlePaginationChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { userRated, currentPage, totalPages, isRated } = this.state;
    const { onRateChange } = this.props;

    const content = (
      <GenresConsumer>
        {(genres) => {
          return <MoviesView isRated={isRated} movies={userRated} genres={genres} handleRateChange={onRateChange} />;
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
      <>
        <Alert message="Hey!" description={`You can edit a score only on "Search" tab`} type="info" showIcon closable />
        <section className="movies-list">
          {content}
          {pagination}
        </section>
      </>
    );
  }
}
