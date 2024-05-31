const fs = require('fs');
const path = require('path');

module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'ihghub',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.AZURE_MYSQL_USER,
    password: process.env.AZURE_MYSQL_PASSWORD,
    database: process.env.AZURE_MYSQL_DATABASE,
    host: process.env.AZURE_MYSQL_HOST,
    port: process.env.AZURE_MYSQL_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(
          path.join(process.env.CA_CERT_PATH, process.env.CA_CERT_NAME)
        ),
        rejectUnauthorized: true, // Ensure server certificate is verified
      },
    },
  },
};
