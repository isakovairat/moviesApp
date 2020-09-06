import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Spin, Pagination, Result } from 'antd';
import clsx from 'clsx';
import { debounce } from 'lodash';
import MovieDb from '../../services/MovieDb';
import MovieCard from '../MovieCard/MovieCard';
import { GenresConsumer } from '../Genres-context';

// const { Search } = Input;

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
    const { movies, isLoading, isError, totalPages, currentPage } = this.state;
    const { onRateChange } = this.props;
    const noResultFound = totalPages === 0 ? <NoResultFound /> : null;
    const spinner = isLoading ? <Spin className="spinner" size="large" /> : null;
    const content = !isLoading ? (
      <GenresConsumer>
        {(genres) => {
          return <MoviesView movies={movies} genres={genres} handleRateChange={onRateChange} />;
        }}
      </GenresConsumer>
    ) : null;

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

const MoviesView = ({ movies, genres, handleRateChange }) => {
  if (movies.length > 1) {
    return movies.map((movie) => {
      const genresToShow = genres
        .filter((genre) => genre.id === movie.genre_ids[0] || genre.id === movie.genre_ids[1])
        .map((genre) => genre.name);
      const posterPath =
        movie.poster_path === null
          ? 'https://picsum.photos/id/392/200/'
          : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

      return (
        <MovieCard
          key={movie.id}
          movie={movie}
          poster={posterPath}
          genres={genresToShow}
          handleRateChange={(newRate) => {
            handleRateChange(newRate, movie);
          }}
        />
      );
    });
  }

  return null;
};

MoviesView.defaultProps = {
  movies: [],
  genres: [],
  handleRateChange: () => {},
};

MoviesView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  movies: PropTypes.array,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  handleRateChange: PropTypes.func,
};

const NoResultFound = () => {
  return <Result title="Result not found" />;
};
