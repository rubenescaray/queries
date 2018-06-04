import { observable, runInAction } from 'mobx';
import 'whatwg-fetch';
import checkStatus from '../../stores/fetchHelpers';

class QueryStore {
  @observable queries;
  @observable results;
  @observable query;
  @observable fetching;
  @observable linkedQuery;
  schema = [];
  snackBarStore = null;

  constructor(getUrl, postUrl, updateUrl, testUrl, getByIdUrl, executeUrl) {
    this.getUrl = getUrl;
    this.postUrl = postUrl;
    this.updateUrl = updateUrl;
    this.testUrl = testUrl;
    this.getByIdUrl = getByIdUrl;
    this.executeUrl = executeUrl;
    this.results = [];
    this.queries = [];
    this.fetching = false;
    this.query = null;
    this.linkedQuery = null;
  }

  clear = () => {
    this.results = [];
    this.schema = [];
  }
  get = (queryId) => {
    return new Promise((resolve, reject) => {
      this.query = null;
      this.fetching = true;
      fetch(`${this.getByIdUrl}/${queryId}`, { credentials: 'same-origin' })
        .then((response) => {
          return response.json();
        }).then((json) => {
          this.query = json;
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
    return this.queries[index];
  }
  findById = (id) => {
    this.query = this.queries.find((query) => { return query.id === id; });
    return this.query;
  }
  fetch(returnResults) {
    return new Promise((resolve, reject) => {
      this.fetching = true;
      fetch(this.getUrl, { credentials: 'same-origin' })
      .then(checkStatus)
        .then((response) => {
          return response.json();
        }).then((json) => {
          this.queries = json;
          this.fetching = false;
          if (returnResults) {
            return resolve(json);
          }
          return resolve();
        })
        .catch((error) => {
          this.fetching = false;
          return reject(error);
        });
    });
  }
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
             if (json.result !== undefined) {
               this.results = json.result;
             }
             if (json.schema !== undefined && json.schema.length > 0) {
               this.schema = json.schema;
             }
             this.fetching = false;
             return resolve(this.schema);
           });
         } else {
           response.json().then((json) => {
             return reject(json.message);
           });
         }
       });
    });
  }
  execute = (query, returnResults) => {
    return new Promise((resolve, reject) => {
      this.fetching = true;
      this.schema = [];
      this.results = [];
      fetch(this.executeUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
      .then(checkStatus)
        .then((response) => {
          return response.json();
        }).then((json) => {
          this.fetching = false;
          if (json.result !== undefined) {
            if (json.schema !== undefined && json.schema.length > 0) {
              this.schema = json.schema;
            }
            if (returnResults) {
              return resolve(json.result);
            }
            this.results = json.result;
          }
          return resolve();
        })
        .catch((error) => {
          this.fetching = false;
          return reject(error);
        });
    });
  }
  add = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.postUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      }).then(checkStatus).then((response) => {
        return response.json();
      }).then((json) => {
        runInAction(() => {
          this.queries.push(json);
          this.fetching = false;
        });
        return resolve();
      })
      .catch((error) => {
        return reject(error);
      });
    });
  }
  update = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.updateUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      }).then(checkStatus).then((response) => {
        return resolve(response.json());
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

export default QueryStore;
