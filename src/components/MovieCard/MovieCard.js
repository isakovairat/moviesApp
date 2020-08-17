import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag } from 'antd';
import format from 'date-fns/format';
import trimOverview from '../../services/trimOverview';

const MovieCard = ({ title, overview, releaseDate, poster }) => {
  return (
    <Card hoverable className="card">
      <img src={poster} alt="" className="card__img" />
      <div className="info">
        <h3 className="info__title">{title}</h3>
        <span className="info__date">{format(new Date(...releaseDate.split('-').map(Number)), 'MMMM d, yyyy')}</span>
        <div className="info__genres">
          <Tag>Action</Tag>
          <Tag>Drama</Tag>
        </div>
        <p className="info__description">{trimOverview(overview)}</p>
      </div>
    </Card>
  );
};

MovieCard.defaultProps = {
  title: 'Some title',
  overview: 'Some overview',
  releaseDate: '01-01-2020',
  poster: 'some poster',
};

MovieCard.propTypes = {
  title: PropTypes.string,
  overview: PropTypes.string,
  releaseDate: PropTypes.string,
  poster: PropTypes.string,
};

export default MovieCard;
