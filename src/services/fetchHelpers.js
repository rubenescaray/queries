export const getToken = () => {
  return localStorage.getItem('token');
};

const checkStatus = (response) => {
  return new Promise((resolve, reject) => {
    if (response.status === 401) {
      console.log(response);
    }
    if (response.ok) {
      return resolve(response);
    }
    response.json().then((responseError) => {
      return reject(responseError.message);
    }).catch(() => {
      return reject(response.statusText);
    });
  });
};

export default checkStatus;
