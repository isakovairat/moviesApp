export default (str) => {
  let res = '';
  const limit = 130;
  const overview = str.split(' ');
  let resLength = 0;
  for (let i = 0; i < overview.length; i++) {
    if (resLength >= limit) {
      if (overview[i][overview[i].length - 1] === ',' || overview[i][overview[i].length - 1] === '.') {
        res += overview[i].slice(0, -1);
      } else {
        res += overview[i];
      }
      break;
    }
    res += `${overview[i]} `;
    resLength += overview[i].length + 1;
  }
  return `${res}...`;
};
