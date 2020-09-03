export default class MovieDb {
  apiKey = '?api_key=1507742add1f7c3396c6a6d758bc37a0';

  async searchMoviesByPageAndName(page, name = 'return') {
    const url = `https://api.themoviedb.org/3/search/movie${this.apiKey}&language=en-US&query=${name}&page=${page}&include_adult=false`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url} + received ${response.status}`);
    }

    const res = await response.json();
    return { movies: res.results, totalPages: res.total_pages };
  }

  async getGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list${this.apiKey}&language=en-US`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url} + received ${response.status}`);
    }
    const res = await response.json();
    return res.genres;
  }

  async auth() {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new${this.apiKey}`);
    if (response.status !== 200) await this.auth();
    const body = await response.json();
    return body.guest_session_id;
  }

  async rate(movieId, score, sessionId) {
    const request = new Request(
      `https://api.themoviedb.org/3/movie/${+movieId}/rating${this.apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: score,
        }),
      }
    );

    await fetch(request);
  }
}
