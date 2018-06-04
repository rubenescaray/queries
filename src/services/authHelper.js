export const includeToken = () => {  // eslint-disable-line
  let retorno;
  if ((localStorage.getItem('token') === null)) {
    retorno = null;
  } else {
    retorno = localStorage.getItem('token');
  }
  return retorno;
};
