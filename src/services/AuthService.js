import 'whatwg-fetch';
//import checkStatus from './fetchHelpers';

class AuthService {
  constructor(postUrl) {
    this.postUrl = postUrl;
  }

  login = (username, password) => {
    const details = {
      userName: username,
      password,
      grant_type: 'password'
    };
    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');
    return new Promise((resolve, reject) => {
      fetch(this.postUrl, {
        credentials: 'omit',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody//details
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          return reject(json.error_description);
        }
        localStorage.setItem('token', json.access_token);
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  logout = (key) => {
    return new Promise((resolve, reject) => {
      if (!this.removeExistingItem(key)) {
        return reject('No existe');
      }
      this.removeExistingItem(key);
      resolve(true);
    });
  }

  isAuthorized = (nextState, replace) => {
    console.log('ignore', nextState);
    console.log('ignore', replace);
    if (localStorage.getItem('token') === null) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  removeExistingItem = (key) => {
    if (localStorage.getItem(key) === null) {
      return false;
    }
    localStorage.removeItem(key);
    return true;
  };
}

export default AuthService;
