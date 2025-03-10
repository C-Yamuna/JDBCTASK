// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev nvironment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.


export const environment = {
  production: false,
  env: 'dev',
  ERPinvestments: 'http://localhost:8080/schemas',
  // apiBase: 'http://192.168.1.62:8079/ERPRbac/',
  // erp_rbac: 'http://192.168.1.62:8079/ERPRbac/api/v1',
  // erp_savings_bank :'http://localhost:9031'
  apiUrl: 'http://localhost:8080/schemas',
  apiBaseUrl: 'http://localhost:8080/schemas'
};

