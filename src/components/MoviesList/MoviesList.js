import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import MovieDb from '../../services/MovieDb';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';
import MovieCard from '../MovieCard/MovieCard';

import './MoviesList.css';

export default class MoviesList extends Component {
  movieDb = new MovieDb();

  state = {
    movies: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.updateMovies();
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
      error: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateMovies = () => {
    this.movieDb.showMoviesPage().then(this.onMoviesLoaded).catch(this.onError);
  };

  render() {
    const { movies, loading, error } = this.state;
    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spin className="spinner" size="large" /> : null;
    const content = hasData ? <MoviesView movies={movies} /> : null;

    return (
      <section className="movie-list">
        {errorMessage}
        {spinner}
        {content}
      </section>
    );
  }
}

const MoviesView = ({ movies }) => {
  return movies.map((movie) => {
    return (
      <MovieCard
        key={movie.id}
        title={movie.title}
        overview={movie.overview}
        releaseDate={movie.release_date}
        poster={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
      />
    );
  });
};

MoviesView.defaultProps = {
  movies: [],
};

MoviesView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  movies: PropTypes.array,
};
