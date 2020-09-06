import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Card, Pagination, Progress, Rate, Tag } from 'antd';
import clsx from 'clsx';
import format from 'date-fns/format';
import { GenresConsumer } from '../Genres-context';
import getVoteAverageColor from '../../services/getVoteAverageColor';
import trimOverview from '../../services/trimOverview';

export default class RatedList extends Component {
  static defaultProps = {
    userRated: [],
  };

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    userRated: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { userRated } = this.props;

    this.state = {
      currentPage: 1,
      totalPages: null,
      userRated,
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
    const { userRated, currentPage, totalPages } = this.state;

    const content = (
      <GenresConsumer>
        {(genres) => {
          return <MoviesView movies={userRated} genres={genres} />;
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

const MoviesView = ({ movies, genres }) => {
  if (movies.length > 0) {
    return movies.map((movie) => {
      const genresToShow = genres
        .filter((genre) => genre.id === movie.movie.genre_ids[0] || genre.id === movie.movie.genre_ids[1])
        .map((genre) => genre.name);
      const posterPath =
        movie.movie.poster_path === null
          ? 'https://picsum.photos/id/392/200/'
          : `https://image.tmdb.org/t/p/w200${movie.movie.poster_path}`;

      return (
        <Card key={movie.movie.id} hoverable className="card">
          <img src={posterPath} alt="Movie poster" className="card__img" />
          <div className="info">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 className="info__title">{movie.movie.title}</h3>
                <Progress
                  type="circle"
                  percent={100}
                  format={() => movie.movie.vote_average}
                  strokeColor={getVoteAverageColor(+movie.movie.vote_average)}
                  status="normal"
                  width={33}
                  style={{ marginRight: '5px' }}
                />
              </div>
              <span className="info__date">
                {format(new Date(...movie.movie.release_date.split('-').map(Number)), 'MMMM d, yyyy')}
              </span>
              <div className="info__genres">
                {genresToShow.map((genre) => (
                  <Tag key={genre}>{genre}</Tag>
                ))}
              </div>
              <p className="info__description">{trimOverview(movie.movie.overview)}</p>
            </div>
            <Rate allowHalf value={movie.score} count={10} />
          </div>
        </Card>
      );
    });
  }
  return <Alert className="alert" message="Not so fast!" description="Please rate some movies" type="info" showIcon />;
};

MoviesView.defaultProps = {
  movies: [],
  genres: [],
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
};
