const fs = require('fs');

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
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt'),
    //   },
    // },
  },
};
