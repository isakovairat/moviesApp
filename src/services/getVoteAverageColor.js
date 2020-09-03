export default (voteAverage) => {
  if (voteAverage >= 0 && voteAverage < 3) {
    return '#E90000';
  }
  if (voteAverage >= 3 && voteAverage < 5) {
    return '#E97E00';
  }
  if (voteAverage >= 5 && voteAverage < 7) {
    return '#E9D100';
  }
  return '#66E900';
};
