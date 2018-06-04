import { observable } from 'mobx';
import 'whatwg-fetch';
import checkStatus from '../../stores/fetchHelpers';

class CatalogStore {
  @observable sources;

  constructor(getUrl) {
    this.getUrl = getUrl;
    this.sources = [];
    this.fetching = false;
  }
  clear = () => {
    this.sources = [];
  }
  fetch() {
    return new Promise((resolve, reject) => {
      this.fetching = true;
      fetch(this.getUrl, { credentials: 'same-origin' })
      .then(checkStatus)
      .then((response) => {
        return response.json();
      }).then((json) => {
        this.sources = json;
        this.fetching = false;
        return resolve(json);
      })
      .catch((error) => {
        this.fetching = false;
        return reject(error);
      });
    });
  }
}


export default CatalogStore;
