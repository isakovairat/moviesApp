import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Spin, Pagination, Result } from 'antd';
import clsx from 'clsx';
import { debounce } from 'lodash';
import MovieDb from '../../utils/MovieDb';
import MoviesView from '../MoviesView/MoviesView';
import { GenresConsumer } from '../Genres-context';

export default class MoviesList extends Component {
  static defaultProps = {
    onError: () => {},
    onRateChange: () => {},
  };

  static propTypes = {
    onError: PropTypes.func,
    onRateChange: PropTypes.func,
  };

  movieDb = new MovieDb();

  updateMovies = debounce((pageNumber = 1) => {
    const { inputQuery } = this.state;
    this.movieDb.searchMovies(pageNumber, inputQuery).then(this.onMoviesLoaded).catch(this.onError);
    this.setState({
      currentPage: pageNumber,
    });
  }, 500);

  constructor(props) {
    super(props);

    this.state = {
      inputQuery: 'return',
      currentPage: 1,
      movies: [],
      isLoading: true,
      isError: false,
      totalPages: null,
      isRated: false,
    };

    this.updateMovies = this.updateMovies.bind(this);
  }

  componentDidMount() {
    this.updateMovies();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { inputQuery } = this.state;
    if (prevState.inputQuery !== inputQuery) {
      this.updateMovies();
    }
  }

  onMoviesLoaded = ({ movies, totalPages }) => {
    this.setState({
      movies,
      isLoading: false,
      isError: false,
      totalPages,
    });
  };

  onError = () => {
    const { onError } = this.props;

    this.setState({
      isError: true,
      isLoading: false,
    });
    onError();
  };

  handleInputChange = (event) => {
    this.setState({
      inputQuery: event.target.value.length > 0 ? event.target.value : 'return',
      isLoading: true,
    });
    this.updateMovies();
  };

  handlePaginationChange = (pageNumber) => {
    this.updateMovies(pageNumber);
    this.setState({ isLoading: true });
  };

  render() {
    const { movies, isLoading, isError, totalPages, currentPage, isRated } = this.state;
    const { onRateChange } = this.props;
    const noResultFound = totalPages === 0 ? <NoResultFound /> : null;
    const spinner = isLoading ? <Spin className="spinner" size="large" /> : null;
    const content = !isLoading ? (
      <GenresConsumer>
        {(genres) => {
          return <MoviesView isRated={isRated} movies={movies} genres={genres} handleRateChange={onRateChange} />;
        }}
      </GenresConsumer>
    ) : null;

    const pagination = !isError && !isLoading && (
      <Pagination
        current={currentPage}
        size="small"
        total={totalPages}
        className={clsx({ pagination: true, hidden: isError })}
        hideOnSinglePage
        onChange={this.handlePaginationChange}
      />
    );

    return (
      <section className="movies-list">
        <Input
          size="middle"
          placeholder="Type to search..."
          className={clsx({ input: true, hidden: isError })}
          onChange={this.handleInputChange}
        />
        {noResultFound}
        {spinner}
        {content}
        {pagination}
      </section>
    );
  }
}

const NoResultFound = () => {
  return <Result title="Result not found" />;
};
