const path = require("path");

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": path.resolve(__dirname,"../db/development.sqlite3")
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": path.resolve(__dirname,"../db/test.sqlite3")
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": path.resolve(__dirname,"../db/production.sqlite3")
  }
};