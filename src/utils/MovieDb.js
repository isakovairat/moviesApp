import dotenv from 'dotenv';

dotenv.config();

export default class MovieDb {
  async searchMovies(page, name) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${name}&page=${page}&include_adult=false`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url} + received ${response.status}`);
    }

    const res = await response.json();
    return { movies: res.results, totalPages: res.total_pages };
  }

  async getGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url} + received ${response.status}`);
    }
    const res = await response.json();
    return res.genres;
  }

  async auth() {
    const url = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
    const response = await fetch(url);
    if (response.status !== 200) await this.auth();
    const body = await response.json();
    return body.guest_session_id;
  }

  async rateMovie(movieId, score, sessionId) {
    const url = `https://api.themoviedb.org/3/movie/${+movieId}/rating?api_key=${
      process.env.REACT_APP_TMDB_API_KEY
    }&guest_session_id=${sessionId}`;
    const request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: score,
      }),
    });

    await fetch(request);
  }
}
