import { observable/*,runInAction*/ } from 'mobx';

class TopBarStore {
  @observable error;
  logoutResult

  constructor(authService, snackBarStore) {
    this.authService = authService;
    this.snackBarStore = snackBarStore;
    this.error = '';
    this.logoutResult = false;
  }

  logout = (key) => {
    return new Promise((resolve, reject) => {
      this.authService.logout(key).then((result) => {
        if (!result) {
          return reject('Hubo un error en el servicio');
        }
        this.logoutResult = result;
        resolve(true);
      }).catch((error) => {
        this.error = error;
        reject(error.message);
      });
    });
  }
}

export default TopBarStore;
