import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Spin, Pagination, Result } from 'antd';
import { debounce } from 'lodash';
import clsx from 'clsx';
import MovieDb from '../../services/MovieDb';
import MovieCard from '../MovieCard/MovieCard';

export default class MoviesList extends Component {
  static defaultProps = {
    onError: () => {},
  };

  static propTypes = {
    onError: PropTypes.func,
  };

  movieDb = new MovieDb();

  state = {
    inputQuery: 'return',
    currentPage: 1,
    movies: [],
    isLoading: true,
    isError: false,
    totalPages: null,
  };

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

  updateMovies = (pageNumber = 1) => {
    const { inputQuery } = this.state;
    this.movieDb.searchMoviesByPageAndName(pageNumber, inputQuery).then(this.onMoviesLoaded).catch(this.onError);
    this.setState({
      currentPage: pageNumber,
      isLoading: false,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      inputQuery: event.target.value.length > 0 ? event.target.value : 'return',
      isLoading: true,
    });

    debounce(() => {
      this.updateMovies();
    }, 1000)();
  };

  handlePaginationChange = (pageNumber) => {
    this.updateMovies(pageNumber);
    this.setState({ isLoading: true });
  };

  render() {
    const { movies, isLoading, isError, totalPages, currentPage } = this.state;

    const noResultFound = totalPages === 0 ? <NoResultFound /> : null;
    const spinner = isLoading ? <Spin className="spinner" size="large" /> : null;
    const content = !isLoading ? <MoviesView movies={movies} /> : null;
    const pagination =
      !isError && !isLoading ? (
        <Pagination
          current={currentPage}
          size="small"
          total={totalPages}
          className={clsx({ pagination: true, hidden: isError })}
          hideOnSinglePage
          onChange={this.handlePaginationChange}
        />
      ) : null;

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

const MoviesView = ({ movies }) => {
  if (movies.length > 1) {
    return movies.map((movie) => {
      const posterPath =
        movie.poster_path === null
          ? 'https://picsum.photos/id/392/200/'
          : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

      return (
        <MovieCard
          key={movie.id}
          title={movie.title}
          overview={movie.overview}
          releaseDate={movie.release_date}
          poster={posterPath}
        />
      );
    });
  }

  return null;
};

MoviesView.defaultProps = {
  movies: [],
};

MoviesView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  movies: PropTypes.array,
};

const NoResultFound = () => {
  return <Result title="Result not found" />;
};
