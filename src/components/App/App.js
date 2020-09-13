import React, { Component } from 'react';
import { Tabs } from 'antd';
import clsx from 'clsx';
import MoviesList from '../MoviesList/MoviesList';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';
import RatedList from '../RatedList/RatedList';
import MovieDb from '../../utils/MovieDb';
import { GenresProvider } from '../Genres-context';

export default class App extends Component {
  movieDb = new MovieDb();

  constructor(props) {
    super(props);

    this.handleRateChange = this.handleRateChange.bind(this);
  }

  state = {
    isError: false,
    genres: [],
    sessionId: null,
    userRated: [],
  };

  componentDidMount() {
    this.auth();
    this.getGenres();
  }

  onError = () => {
    this.setState({ isError: true });
  };

  getGenres = () => {
    this.movieDb
      .getGenres()
      .then((genres) => {
        this.setState({
          genres,
        });
      })
      .catch(this.onError);
  };

  auth = () => {
    this.movieDb
      .auth()
      .then((sessionId) => {
        this.setState({
          sessionId,
        });
      })
      .catch(this.onError);
  };

  async handleRateChange(score, movie) {
    const { sessionId } = this.state;
    await this.movieDb.rateMovie(movie.id, score, sessionId);
    const { userRated } = this.state;
    if (userRated.length > 0 && userRated.find((el) => el.movie.id === movie.id)) {
      const newUserRated = [...userRated];
      const el = newUserRated.find((elem) => elem.movie.id === movie.id);
      el.score = score;
      this.setState({ userRated: newUserRated });
    } else {
      this.setState({ userRated: [...userRated, { score, movie }] });
    }
  }

  render() {
    const { isError, genres, userRated } = this.state;
    const errorMessage = isError ? <ErrorIndicator /> : null;
    const { TabPane } = Tabs;

    return (
      <GenresProvider value={genres}>
        <div className="page">
          {errorMessage}
          <Tabs defaultActiveKey="search" className={clsx({ hidden: isError })} centered>
            <TabPane tab="Search" key="search">
              <MoviesList onError={this.onError} onRateChange={this.handleRateChange} />
            </TabPane>
            <TabPane tab="Rated" key="rated">
              <RatedList userRated={userRated} onRateChange={this.handleRateChange} />
            </TabPane>
          </Tabs>
        </div>
      </GenresProvider>
    );
  }
}
