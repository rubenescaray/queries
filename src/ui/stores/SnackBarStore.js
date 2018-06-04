import { observable } from 'mobx';

class SnackBarStore {
  @observable message = '';
  @observable isOpen = false;
  setMessage = (message) => {
    this.isOpen = true;
    this.message = message;
  };
  handleRequestClose = () => {
    this.isOpen = false;
  };
}

export default SnackBarStore;
