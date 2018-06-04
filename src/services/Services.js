import Settings from '../settings';
import SourceService from './SourceService';
import QueryService from './QueryService';
import DashboardService from './DashboardService';
import CatalogService from './CatalogService';
import CategoryService from './CategoryService';
import AuthService from './AuthService';

export const sourceService = new SourceService(
  `${Settings.webApiBaseUri}/source/all`,
  `${Settings.webApiBaseUri}/source/NoParameterSources`,
  `${Settings.webApiBaseUri}/source/create`,
  `${Settings.webApiBaseUri}/query/test`,
  `${Settings.webApiBaseUri}/source/get`,
  `${Settings.webApiBaseUri}/source/execute`,
  `${Settings.webApiBaseUri}/source/update`,
);

export const queryService = new QueryService(
  `${Settings.webApiBaseUri}/query/all`,
  `${Settings.webApiBaseUri}/query/linkableQueries`,
  `${Settings.webApiBaseUri}/query/create`,
  `${Settings.webApiBaseUri}/query/update`,
  `${Settings.webApiBaseUri}/query/test`,
  `${Settings.webApiBaseUri}/query/get`,
  `${Settings.webApiBaseUri}/query/execute`,
  `${Settings.webApiBaseUri}/query/executeById`,
);

export const dashboardService = new DashboardService(
  `${Settings.webApiBaseUri}/dashboard/all`,
  `${Settings.webApiBaseUri}/dashboard/add`,
  `${Settings.webApiBaseUri}/dashboard/get`,
  `${Settings.webApiBaseUri}/dashboard/update`,
);

export const catalogService = new CatalogService(
  `${Settings.webApiBaseUri}/catalog/all`
);

export const categoryService = new CategoryService(
  `${Settings.webApiBaseUri}/category/all`
);

export const authService = new AuthService(
  `${Settings.webApiToken}`
);
