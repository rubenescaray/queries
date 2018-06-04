import 'whatwg-fetch';
import checkStatus, { getToken } from './fetchHelpers';

class CatalogService {
  constructor(getUrl) {
    this.getUrl = getUrl;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      fetch(this.getUrl, {
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
  }
}
export default CatalogService;
