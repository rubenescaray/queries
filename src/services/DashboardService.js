import 'whatwg-fetch';
import checkStatus, { getToken } from './fetchHelpers';

class DashboardService {
  constructor(getUrl, postUrl, getByIdUrl, updateUrl) {
    this.getUrl = getUrl;
    this.postUrl = postUrl;
    this.getByIdUrl = getByIdUrl;
    this.updateUrl = updateUrl;
  }

  fetch(complete = true) {
    return new Promise((resolve, reject) => {
      fetch(`${this.getUrl}?complete=${complete !== false}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
      }).then(checkStatus)
         .then((response) => {
           return response.json();
         })
         .then((json) => {
           resolve(json);
         })
         .catch((error) => {
           reject(error);
         });
    });
  }

  get = (dashboardId) => {
    return new Promise((resolve, reject) => {
      fetch(`${this.getByIdUrl}/${dashboardId}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
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
  };

  add = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.postUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(query)
      }).then(checkStatus).then((response) => {
        return response.json();
      }).then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        return reject(error);
      });
    });
  };

  update = (dashboard) => {
    return new Promise((resolve, reject) => {
      fetch(this.updateUrl, {
        credentials: 'same-origin',
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(dashboard)
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
  };
}

export default DashboardService;
