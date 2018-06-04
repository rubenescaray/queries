
/*const Settings = {
  webApiServerSchema: 'http',
  //webApiServerDomain: 'sise-3g-be.azurewebsites.net',
  //webApiServerDomain: 'queryappsistran.azurewebsites.net',
  webApiServerDomain: 'localhost',
  webApiServerRoute: '',
  webApiServerPort: ':60841',
  supportedDateFormat: 'DD/MM/YYYY'
};*/


/*const Settings = {
  webApiServerSchema: 'http',
  webApiServerDomain: '181.143.158.230',
  webApiServerRoute: '/Consultas',
  webApiServerPort: '',
};*/

const Settings = {
  webApiServerSchema: 'http',
  webApiServerDomain: '200.10.99.22',
  webApiServerRoute: '/ConsultasExternal',
  webApiServerPort: '',
};

/*const Settings = {
  webApiServerSchema: 'http',
  webApiServerDomain: 'CORPREST01',
  webApiServerRoute: '/Consultas',
  webApiServerPort: '',
};*/

Settings.supportedDateFormat = 'DD/MM/YYYY';

Settings.webApiToken = `${Settings.webApiServerSchema}://${Settings.webApiServerDomain}${Settings.webApiServerPort}${Settings.webApiServerRoute}/Token`;
Settings.webApiBaseUri = `${Settings.webApiServerSchema}://${Settings.webApiServerDomain}${Settings.webApiServerPort}${Settings.webApiServerRoute}/api`;

export default Settings;
