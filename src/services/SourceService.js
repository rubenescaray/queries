import 'whatwg-fetch';
import checkStatus, { getToken } from './fetchHelpers';

//const token = getToken();

class SourceService {
  constructor(getUrl, getNoParamUrl, postUrl, testUrl, getByIdUrl, executeUrl, updateUrl) {
    this.getUrl = getUrl;
    this.getNoParamUrl = getNoParamUrl;
    this.postUrl = postUrl;
    this.testUrl = testUrl;
    this.getByIdUrl = getByIdUrl;
    this.executeUrl = executeUrl;
    this.updateUrl = updateUrl;
  }
  get = (sourceId) => {
    return new Promise((resolve, reject) => {
      fetch(`${this.getByIdUrl}/${sourceId}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
      }).then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  fetch(onlyNoParam = false, complete = true) {
    return new Promise((resolve, reject) => {
      fetch(`${onlyNoParam === true ? this.getNoParamUrl : this.getUrl}?complete=${complete !== false}`,
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, credentials: 'same-origin' })
      .then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  test = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.testUrl, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(query)
      }).then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  execute = (source) => {
    return new Promise((resolve, reject) => {
      fetch(this.executeUrl, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(source)
      }).then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  executeById = (sourceId) => {
    return new Promise((resolve, reject) => {
      fetch(`${this.executeUrl}/${sourceId}`,
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          credentials: 'same-origin' })
      .then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  add = (source) => {
    return new Promise((resolve, reject) => {
      fetch(this.postUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(source)
      }).then(checkStatus)
      .then((response) => {
        return response.json();
      }).then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }

  update = (source) => {
    return new Promise((resolve, reject) => {
      fetch(this.updateUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(source)
      }).then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }

}

export default SourceService;
