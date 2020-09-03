import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Rate, Progress } from 'antd';
import format from 'date-fns/format';
import trimOverview from '../../services/trimOverview';
import getVoteAverageColor from '../../services/getVoteAverageColor';

export default class MovieCard extends Component {
  static defaultProps = {
    movie: {},
    poster: 'some poster',
    genres: [],
    handleRateChange: () => {},
  };

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    movie: PropTypes.object,
    poster: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    handleRateChange: PropTypes.func,
  };

  state = {
    userScore: 0,
  };

  render() {
    const { movie, poster, genres, handleRateChange } = this.props;
    const { userScore } = this.state;

    return (
      <Card hoverable className="card">
        <img src={poster} alt="Movie poster" className="card__img" />
        <div className="info">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className="info__title">{movie.title}</h3>
              <Progress
                type="circle"
                percent={100}
                format={() => movie.vote_average}
                strokeColor={getVoteAverageColor(+movie.vote_average)}
                status="normal"
                width={33}
                style={{ marginRight: '5px' }}
              />
            </div>
            <span className="info__date">
              {format(new Date(...movie.release_date.split('-').map(Number)), 'MMMM d, yyyy')}
            </span>
            <div className="info__genres">
              {genres.map((genre) => (
                <Tag key={genre}>{genre}</Tag>
              ))}
            </div>
            <p className="info__description">{trimOverview(movie.overview)}</p>
          </div>
          <Rate
            onChange={(newScore) => {
              this.setState({
                userScore: newScore,
              });
              handleRateChange(newScore);
            }}
            allowHalf
            defaultValue={userScore}
            count={10}
          />
        </div>
      </Card>
    );
  }
}
