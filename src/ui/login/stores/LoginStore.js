import { observable/*,runInAction*/ } from 'mobx';

class LoginStore {
  @observable username;
  @observable password;
  @observable error;
  loginResult;
  logoutResult

  constructor(authService, snackBarStore) {
    this.authService = authService;
    this.snackBarStore = snackBarStore;
    this.username = '';
    this.password = '';
    this.error = '';
    this.loginResult = false;
    this.logoutResult = false;
  }

  login = (username, password) => {
    return new Promise((resolve, reject) => {
      this.authService.login(username, password).then((result) => {
        this.loginResult = result;
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  logout = (key) => {
    return new Promise((resolve, reject) => {
      this.authService.logout(key).then((result) => {
        this.logoutResult = result;
        resolve(true);
      }).catch(() => {
        reject('Hubo un error en el LoginStore');
      });
    });
  }
}

export default LoginStore;
