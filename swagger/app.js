'use strict';
var SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api/swagger/api.yaml');
const modules = require("./module/module.js");
const verifyToken = require("./module/user/tokenVerify.js")

console.log("swaggerDocument", swaggerDocument["host"])

if (process.env.swaggerHostName) {
  swaggerDocument["host"] = process.env.swaggerHostName
}
console.log("swaggerDocument", swaggerDocument["host"])
//  const swaggerddd = require('./api/swagger/swagger.yaml')

var app = require('express')();

app.use('/openApiUI', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = app; // for testing
const express = require('express');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var config = {
  appRoot: __dirname // required config
};

// let dbConfig = (() => {
//   let p = 
//   return p;
// })();
let dbConfig = {
  sql: {
    user: process.env.sqluser || 'sa',
    password: process.env.sqlpassword || 'Apple#123',
    database: process.env.sqldatabase || 'Hosttempo_Dev',
    server: process.env.sqlserver || 'roomtempoqa.ccb0buccqamy.ap-south-1.rds.amazonaws.com',
    port: 1403,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    // driver: 'msnodesqlv8',
    options: {
      encrypt: false
    }
  },
  kafka: {
    brokerlist: process.env.kafkabrokerlist || "localhost:19092",
    openApiReservationsNotificationLogTopic: process.env.openApiReservationsNotificationLogTopic || "openApiReservationsNotificationLogTopic",
    openApiGroupId: process.env.openApiGroupId || "dev-apigroupid"
  },
  openApiTokenGeneratingSceretKey: process.env.openApiTokenGeneratingSceretKey || "$ROPENAPIDEV#123$"
}



console.log("db config", dbConfig);
// console.log(config.get("password"))
const getReservationByIdSwagger = require('./module/user/getReservationByIdSwagger')
const sendAvailability = require('./module/user/sendAvailability')
const saveClientConfirmationNumber = require('./module/user/saveClientInfo')
const addUnitInfoDetails = require('./module/user/saveClientInfo')
const updateMessageId = require('./module/user/updateApiSendMessage')

require('./core/core.js')(dbConfig)
  .then(async (config) => {
    config.initConsumer(config)
    modules.forEach((module) => {
      app.post("/getReservationId", (req, res) => {
        const apiHeaders = req.headers

        console.log(apiHeaders.token)
        if (apiHeaders.token) {

          let getVerify = verifyToken(config, apiHeaders)
          // console.log("userDetails", getVerify)

          if (getVerify !== "Invalid Token") {
            let params = req.body;
            // console.log(apiHeaders.token)
            // console.log("get reservation");
            // module.callback
            getReservationByIdSwagger(config, getVerify, params, (err, response) => {
              console.log("yes")
              if (err) {
                res.send(err)
                return
              }
              else {
                res.send(response)
              }
            })
          }
          else {
            res.send("invalidToken")
          }
        } else {
          res.send("Can not Find token")
        }

      })
      app.post("/postAvailability", (req, res) => {

        const apiHeaders = req.headers
        // console.log(apiHeaders)
        let getVerify = verifyToken(config, apiHeaders)
        // console.log("userDetails", getVerify)
        if (apiHeaders.token) {
          if (getVerify !== "Invalid Token") {
            let params = req.body;
            // console.log(apiHeaders.token)
            // console.log("get reservation");
            // module.callback
            sendAvailability(config, getVerify, params, (err, response) => {
              if (err) {
                res.send("Error in Updating availability")
                return
              }
              else {
                res.send("Post availability success")
              }
            })
          }
          else {
            res.send("invalidToken")
          }
        }
        else {
          res.send("Can not Find token")
        }

      })
      app.post("/postClientPMSConfirmationNumber", (req, res) => {
        const apiHeaders = req.headers
        if (apiHeaders.token) {
          let getVerify = verifyToken(config, apiHeaders)
          if (getVerify !== "Invalid Token") {
            let params = req.body;
            let messsageParams = {
              MessageId: params.messageId,
              ReservationId: params.TempoReservationId,
              SyncStatusId: 4,
              ClientResponse: params,
              ClientConfirmationNumber: params.clientPMSConfirmationNumber
            }

            // module.callback
            updateMessageId(config, getVerify, messsageParams, (err, response) => {
              if (err) {
                res.send("Error in update in Client PMS confirmation")
                return
              }
              res.send("Updated Successfully")
            })
          }
          else {
            res.send("invalidToken")
          }
        }
        else {
          res.send("Can not Find token")
        }
      })
      app.post("/addUnitInfoDetails", (req, res) => {
        const apiHeaders = req.headers
        if (apiHeaders.token) {
          let getVerify = verifyToken(config, apiHeaders)
          if (getVerify !== "Invalid Token") {
            let params = req.body;

            // module.callback
            addUnitInfoDetails(config, getVerify, params, (err, response) => {
              if (err) {
                res.send(err)
                return
              }
              res.send(response)
            })
          }
          else {
            res.send("invalidToken")
          }
        }
        else {
          res.send("Can not Find token")
        }
      })

    })
  })





SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.swaggerPort || 5001;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
