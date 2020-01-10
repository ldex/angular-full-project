// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  demo: true,
  offline: false
};

export const config = {
  apiUrl: 'https://storerestservice.azurewebsites.net/api/products/',
  adminApiUrl: 'https://storerestservice.azurewebsites.net/api/admin/',
  authUrl: 'https://demo4545606.mockable.io/api/login'
};
