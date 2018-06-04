import { observable, runInAction } from 'mobx';
/*eslint no-param-reassign: ["error", { "props": false }]*/
const flatten = (list) => {
  const result = [];

  const addItem = (item, parentIndex, depth = 1) => {
    item.depth = depth;
    const index = result.length;
    if (parentIndex !== undefined) {
      item.parentIndex = parentIndex;
      if (!result[parentIndex].children) {
        result[parentIndex].children = [];
      }
      result[parentIndex].children.push(index);
    }
    result.push(item);
    if (item.categories) {
      item.categories = item.categories.map((c) => { return addItem(c, index, depth + 1); });
    }
    return index;
  };
  // Add top-level items
  list.forEach((item) => { return addItem(item); });
  return result;
};

class QueryListStore {
  queries = [];
  categoryFilter = null;
  @observable filteredQueries = [];
  @observable currentPage = 0;
  @observable fetching = false;
  @observable openMenu = false;
  @observable activeTreeViewIndex = null;
  @observable expandedTreeViewIndexs = [];
  @observable categoryFilter = null;
  @observable categories = [];
  @observable childQueryId = null;
  @observable childQueryParameters = [];

  constructor(queryService, snackBarStore, categoryService) {
    this.queryService = queryService;
    this.snackBarStore = snackBarStore;
    this.categoryService = categoryService;
  }

  fetch() {
    if (this.queries.length === 0) {
      this.fetching = true;
      this.queryService.fetch()
      .then((result) => {
        this.queries = result;
        runInAction(() => {
          this.filteredQueries = result;
          this.fetching = false;
        });
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
      });
    }
  }

  fetchCategories() {
    if (this.categories.length === 0) {
      this.fetching = true;
      this.categoryService.fetch()
      .then((result) => {
        runInAction(() => {
          this.categories = flatten(result);
          this.fetching = false;
        });
      }).catch((error) => {
        this.snackBarStore.setMessage(error);
      });
    }
  }
  add = (query) => {
    this.queryService.add(query)
    .then((response) => {
      const result = {
        id: response.id,
        name: response.name,
        description: response.description,
        sourceName: response.sourceName,
        category: response.category
      };
      runInAction(() => {
        this.queries.push(result);
        this.filter();
      });
    }).catch((error) => {
      this.snackBarStore.setMessage(error);
    });
  }
  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  }
  setOpenMenu = (open) => {
    this.openMenu = open;
  }
  setActiveTreeViewItem = (index, category) => {
    runInAction(() => {
      this.activeTreeViewIndex = index;
      this.categoryFilter = category;
      this.filter();
    });
  }
  filter = () => {
    if (this.categoryFilter) {
      this.filteredQueries = this.queries.filter((query) => { return query.category && query.category.name === this.categoryFilter; });
    } else {
      this.filteredQueries = this.queries;
    }
  }
  addIndexToTreeViewIndexs = (index) => {
    this.expandedTreeViewIndexs.push(index);
  }
  removeIndexFromTreeViewIndex = (index) => {
    this.expandedTreeViewIndexs.splice(index, 1);
  }
}

export default QueryListStore;

