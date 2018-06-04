import { observable } from 'mobx';

class LoaderStore {
  @observable loading = false;
  start = () => {
    this.loading = true;
  };
  end = () => {
    this.loading = false;
  };
}

export default LoaderStore;
