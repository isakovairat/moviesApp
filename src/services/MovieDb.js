export default class MovieDb {
  _apiKey = '?api_key=1507742add1f7c3396c6a6d758bc37a0';

  _apiBase = 'https://api.themoviedb.org/3/search/movie';

  async searchMoviesByPageAndName(page, name = 'return') {
    // eslint-disable-next-line no-underscore-dangle
    const url = `${this._apiBase}${this._apiKey}&language=en-US&query=${name}&page=${page}&include_adult=false`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url} + received ${response.status}`);
    }

    const res = await response.json();
    console.log(res);
    return { movies: res.results, totalPages: res.total_pages };
  }
}
