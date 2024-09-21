const fs = require('fs');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envConfig = dotenv.parse(fs.readFileSync(envFile));

const targetPath = './src/environments/environment.ts';
const envFileContent = `
  export const environment = {
    production: ${env === 'production'},
    apiUrl: '${envConfig.API_URL}'
  };
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`Environment variables written to ${targetPath}`);
