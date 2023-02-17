// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false
};

export const config = {
  apiUrl: 'https://storerestservice.azurewebsites.net/api',
  adminApiUrl: 'https://run.mocky.io/v3/2f4c5296-0578-4a2b-b447-fb8c45a04643',
  authUrl: 'https://run.mocky.io/v3/219bc775-c20e-448e-85b2-d935eeedc7ab',
  storageTokenKey: 'auth_token',
  useCartSubject: true
};
