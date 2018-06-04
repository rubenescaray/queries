import { observable } from 'mobx';
import 'whatwg-fetch';
import checkStatus from '../../stores/fetchHelpers';

class SourceStore {
  @observable sources;
  @observable results;
  @observable source;
  @observable fetching;
  @observable schema = [];
  snackBarStore = null;

  constructor(getUrl, postUrl, testUrl, getByIdUrl) {
    this.getUrl = getUrl;
    this.postUrl = postUrl;
    this.testUrl = testUrl;
    this.getByIdUrl = getByIdUrl;
    this.results = [];
    this.sources = [];
    this.fetching = false;
    this.source = null;
  }
  clear = () => {
    this.results = [];
    this.schema = [];
  }
  clearResults = () => {
    this.results = [];
  }
  get = (sourceId) => {
    return new Promise((resolve, reject) => {
      this.source = null;
      this.fetching = true;
      fetch(`${this.getByIdUrl}/${sourceId}`, { credentials: 'same-origin' })
      .then(checkStatus)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.source = json;
        this.fetching = false;
        return resolve(json);
      })
      .catch((error) => {
        this.fetching = false;
        return reject(error);
      });
    });
  }
  find = (index) => {
    this.source = this.sources[index];
    return this.source;
  }
  findById = (id) => {
    const foundSource = this.sources.find((source) => { return source.id === id; });
    return foundSource;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      this.fetching = true;
      fetch(this.getUrl, { credentials: 'same-origin' })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            this.sources = json;
            this.fetching = false;
            return resolve(json);
          });
        } else {
          response.json().then((json) => {
            this.fetching = false;
            return reject(json.message);
          });
        }
      });
    });
  }
      /*.then((response) => {
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
    });*/
  test = (query) => {
    return new Promise((resolve, reject) => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
      fetch(this.testUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((json) => {
              this.schema = json.schema;
              this.results = json.result;
              this.fetching = false;
              return resolve(this.schema);
            });
          } else {
            response.json().then((json) => {
              this.fetching = false;
              return reject(json.message);
            });
          }
        });
    });
  }
  add = (source) => {
    return new Promise((resolve, reject) => {
      fetch(this.postUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(source)
      }).then(checkStatus).then((response) => {
        return response.json();
      }).then((json) => {
        const result = {
          id: json.id,
          name: json.name,
          description: json.description,
          command: json.command,
          type: json.type,
          parameters: json.parameters
        };
        this.sources.concat(result);
        return resolve();
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
}


export default SourceStore;
