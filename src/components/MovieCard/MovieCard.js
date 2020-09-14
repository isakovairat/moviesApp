import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Rate, Progress } from 'antd';
import trimOverview from '../../utils/trimOverview';
import getVoteAverageColor from '../../utils/getVoteAverageColor';
import checkDate from '../../utils/checkDate';

export default class MovieCard extends Component {
  static defaultProps = {
    movie: {},
    poster: 'some poster',
    genres: [],
    handleRateChange: () => {},
    score: 0,
  };

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    movie: PropTypes.object,
    poster: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    handleRateChange: PropTypes.func,
    score: PropTypes.number,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    userScore: this.props.score,
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { score } = this.props;
    if (prevProps.score !== score) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userScore: score });
    }
  }

  render() {
    const { movie, poster, genres, handleRateChange } = this.props;
    const { userScore } = this.state;

    return (
      <Card key={movie.id} hoverable className="card">
        <img src={poster} alt="Movie poster" className="card__img" />
        <div className="info">
          <div className="right">
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
            <span className="info__date">{checkDate(movie.release_date)}</span>
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
            value={userScore}
            count={10}
          />
        </div>
      </Card>
    );
  }
}
