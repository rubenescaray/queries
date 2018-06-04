import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router';
import { Provider } from 'mobx-react';
import { createHashHistory } from 'history';
import App from './App';
import Settings from './settings';
import SourceStore from './ui/source-crud/stores/SourceStore';
//import SourceList from './ui/source-crud/SourceList';
import SourceListTabs from './ui/source-crud/SourceListTabs';
import SourceListStore from './ui/source-crud/stores/SourceListStore';
import QueryListStore from './ui/query-crud/stores/QueryListStore';
import SourceForm from './ui/source-crud/SourceForm';
import SourceEdit from './ui/source-crud/SourceEdit';
import CatalogService from './services/CatalogService';
//import AuthService from './Services/AuthService';
import { sourceService, queryService, categoryService, authService, dashboardService } from './services/Services';
import CategoryStore from './ui/query-crud/stores/CategoryStore';
import QueryStore from './ui/query-crud/stores/QueryStore';
import SnackBarStore from './ui/stores/SnackBarStore';
import LoaderStore from './ui/stores/LoaderStore';
import QueryForm from './ui/query-crud/QueryForm';
import QueryEdit from './ui/query-crud/QueryEdit';
//import QueryList from './ui/query-crud/QueryList';
import QueryListTabs from './ui/query-crud/QueryListTabs';
import QueryExecute from './ui/query-crud/QueryExecute';
import SourceCrud from './ui/source-crud/SourceCrud';
import QueryCrud from './ui/query-crud/QueryCrud';
import SourceExecute from './ui/source-crud/SourceExecute';
import Menu from './ui/menus/Menu';
import Login from './ui/login/Login';
import LoginStore from './ui/login/stores/LoginStore';
import Dashboard from './ui/dashboard-crud/Dashboard';
//import DashboardList from './ui/dashboard-crud/DashboardList';
import DashboardListTabs from './ui/dashboard-crud/DashboardListTabs';
import DashboardListStore from './ui/dashboard-crud/stores/DashboardListStore';
import DashboardCrud from './ui/dashboard-crud/DashboardCrud';
import DashboardForm from './ui/dashboard-crud/DashboardForm';


const sourceStore = new SourceStore(
  `${Settings.webApiBaseUri}/source/all`,
  `${Settings.webApiBaseUri}/source/create`,
  `${Settings.webApiBaseUri}/query/test`,
  `${Settings.webApiBaseUri}/source/get`,
  `${Settings.webApiBaseUri}/source/update`
);

const queryStore = new QueryStore(
  `${Settings.webApiBaseUri}/query/all`,
  `${Settings.webApiBaseUri}/query/create`,
  `${Settings.webApiBaseUri}/query/update`,
  `${Settings.webApiBaseUri}/query/test`,
  `${Settings.webApiBaseUri}/query/get`,
  `${Settings.webApiBaseUri}/query/execute`,
);

const snackBarStore = new SnackBarStore();
const loaderStore = new LoaderStore();

const catalogService = new CatalogService(
  `${Settings.webApiBaseUri}/catalog/all`
);

const services = {
  sourceService,
  queryService,
  dashboardService,
  categoryService,
  catalogService,
  authService
};

const sourceListStore = new SourceListStore(sourceService, snackBarStore, loaderStore);
const queryListStore = new QueryListStore(queryService, snackBarStore, categoryService);
const dashboardListStore = new DashboardListStore(dashboardService, snackBarStore);
const categoryStore = new CategoryStore(categoryService);
const loginStore = new LoginStore(authService);

const stores = { sourceStore, categoryStore, queryStore, snackBarStore, sourceListStore, queryListStore, dashboardListStore, loaderStore, loginStore };

const browserHistory = useRouterHistory(createHashHistory)();

const routes = (
  <Provider {...stores} {...services}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/*<IndexRedirect to="/login" />*/}
        <IndexRedirect to="/sources/index" />
        <Route path="login" components={{ content: Login }} />
        <Route path="sources" components={{ content: SourceCrud, menu: Menu }} onEnter={authService.isAuthorized}>
          {/*<Route path="index" component={SourceList} />*/}
          <Route path="index" component={SourceListTabs} />
          <Route path="create" component={SourceForm} />
          <Route path="edit/:id" component={SourceEdit} />
          <Route path="preview/:id" component={SourceExecute} />
        </Route>
        <Route path="queries" components={{ content: QueryCrud, menu: Menu }} onEnter={authService.isAuthorized}>
          {/*<Route path="index" component={QueryList} />*/}
          <Route path="index" component={QueryListTabs} />
          <Route path="create" component={QueryForm} />
          <Route path="edit/:id" component={QueryEdit} />
          <Route path="execute/:id/:hasrequiredparams" component={QueryExecute} />
        </Route>
        <Route path="dashboard" components={{ content: DashboardCrud, menu: Menu }} onEnter={authService.isAuthorized}>
          {/*<Route path="index" component={DashboardList} />*/}
          <Route path="index" component={DashboardListTabs} />
          <Route path="create" component={DashboardForm} />
          <Route path="managedashboard/:id/isediting/:isEditing" component={Dashboard} />
        </Route>
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(
  routes,
  document.getElementById('app')
);
