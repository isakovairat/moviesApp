import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'antd';
import MovieCard from '../MovieCard';

const MoviesView = ({ movies, genres, handleRateChange }) => {
  if (movies.length > 0) {
    return movies.map((movie) => {
      const movieInfo = movie.movie;
      const genresToShow = genres
        .filter((genre) => genre.id === movieInfo.genre_ids[0] || genre.id === movieInfo.genre_ids[1])
        .map((genre) => genre.name);
      const posterPath =
        movieInfo.poster_path === null
          ? 'https://picsum.photos/id/392/200/'
          : `https://image.tmdb.org/t/p/w200${movieInfo.poster_path}`;

      return (
        <MovieCard
          score={movie.score}
          key={movieInfo.id}
          movie={movieInfo}
          poster={posterPath}
          genres={genresToShow}
          handleRateChange={(newRate) => {
            handleRateChange(newRate, movieInfo);
          }}
        />
      );
    });
  }

  return <Alert className="alert" message="Not so fast!" description="Please rate some movies" type="info" showIcon />;
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

export default MoviesView;
