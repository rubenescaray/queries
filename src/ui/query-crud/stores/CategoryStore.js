import { observable, runInAction } from 'mobx';

class CategoryStore {
    @observable entries = [];
    @observable categories = [];

  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  fetch = () => {
    this.categoryService.fetch().then((entries) => {
      let categories = [];
      entries.forEach((entry) => {
        categories = categories.concat(entry.categories);
      });
      runInAction(() => {
        this.entries = entries;
        this.categories = categories;
      });
      //console.log('actualizo categoriesStore');
    });
  }

  getEntryById = (entryId) => {
    return this.entries.find((entry) => {
      return entry.id === entryId;
    });
  }

  getCategoryById = (categoryId) => {
    return this.categories.find((category) => {
      return category.id === categoryId;
    });
  }

  filterCategoriesByEntryName = (entryName) => {
    this.categories = this.categories.filter((category) => {
      return category.entryName === entryName;
    });
  }
}

export default CategoryStore;
