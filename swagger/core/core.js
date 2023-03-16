const express = require("express");
const sql = require("mssql");
const app = express();
let mssql = require("mssql");
let _dbwrapper = require("../db/dbWrapper.js");
let _consumer = require("../kafka/consumer");

module.exports = async function (configParams) {
  try {
    const config = {
      server: configParams.sql.server,
      user: configParams.sql.user,
      password: configParams.sql.password,
      // password: 'Apple#123',
      database: configParams.sql.database,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: configParams.sql.options.encrypt,
        appName: "cloud-roomtemp0",
      },
      connectionTimeout: 50000,
      requestTimeout: 50000,
    };

    if (configParams.sql.port) {
      config.port = configParams.sql.port;
    }

    console.log("config" + JSON.stringify(config));

    mssql.connect(config).then((_pool) => {
      console.log(
        "MSSQLSERVER Connection Established..!",
        configParams.sql.database
      );
    });

    mssql.on("error", (err) => {
      // ... error handler
      console.log(err);
    });

    let dbwrapper = await _dbwrapper(mssql);

    return {
      dbwrapper: dbwrapper,
      initConsumer: _consumer,
      kafka: configParams.kafka,
      openApiReservationsNotificationLogTopic: configParams.kafka.openApiReservationsNotificationLogTopic,
      openApiTokenGeneratingSceretKey: configParams.openApiTokenGeneratingSceretKey,
      openApiGroupId: configParams.kafka.openApiGroupId,
      // openApiTokenGeneratingSceretKey: configParams.openApiTokenGeneratingSceretKey
    };
  } catch (err) {
    Promise.reject(err);
  }
};
