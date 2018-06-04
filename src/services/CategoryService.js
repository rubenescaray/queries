import 'whatwg-fetch';
import Axios from 'axios';
import /*checkStatus,*/ { getToken } from './fetchHelpers';

class CategoryService {
  constructor(getUrl) {
    this.getUrl = getUrl;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      };
      Axios.get(this.getUrl, config)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((error) => {
        return reject(error);
      });
      /*fetch(this.getUrl, {
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
      });*/
    });
  }
}
export default CategoryService;
