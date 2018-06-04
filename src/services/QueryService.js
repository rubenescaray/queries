import 'whatwg-fetch';
import checkStatus, { getToken } from './fetchHelpers';

class QueryService {
  constructor(getUrl, getLinkableUrl, postUrl, updateUrl, testUrl, getByIdUrl, executeUrl, executeByIdUrl) {
    this.getUrl = getUrl;
    this.getLinkableUrl = getLinkableUrl;
    this.postUrl = postUrl;
    this.updateUrl = updateUrl;
    this.testUrl = testUrl;
    this.getByIdUrl = getByIdUrl;
    this.executeUrl = executeUrl;
    this.executeByIdUrl = executeByIdUrl;
  }

  get = (queryId) => {
    return new Promise((resolve, reject) => {
      fetch(`${this.getByIdUrl}/${queryId}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
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
  fetchLinkableQueries() {
    return new Promise((resolve, reject) => {
      fetch(this.getLinkableUrl, {
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
  test = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.testUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(query)
      }).then(checkStatus)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          return resolve({ result: json.result, schema: json.schema });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
  execute = (query) => {
    const queryToExecute = query;
    queryToExecute.complete = query.complete === undefined ? false : query.complete;
    return new Promise((resolve, reject) => {
      fetch(this.executeUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(queryToExecute)
      }).then(checkStatus)
        .then((response) => {
          return response.json();
        }).then((json) => {
          return resolve({ result: json.result, schema: json.schema });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  executeById = (queryId) => {
    return new Promise((resolve, reject) => {
      fetch(`${this.executeUrl}/${queryId}`, {
        credentials: 'same-origin',
        method: 'GET',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } })
        .then(checkStatus)
        .then((response) => {
          return response.json();
        }).then((json) => {
          return resolve({
            queryName: json.queryName,
            category: json.category,
            queryDescription: json.queryDescription,
            result: json.results.result,
            source: json.source,
            schema: json.results.schema,
            parameters: json.parameters,
            selects: json.selects,
            filters: json.filters,
            group: json.group,
            sorts: json.sorts,
            summary: json.summary,
            isSingleQuery: json.isSingleQuery,
            linkedQueryId: json.linkedQueryId,
            linkedQueryParametersMap: json.linkedQueryParametersMap
          });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

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
  }
  update = (query) => {
    return new Promise((resolve, reject) => {
      fetch(this.updateUrl, {
        credentials: 'same-origin',
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
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
}

export default QueryService;

