// 'use strict';
// var SwaggerExpress = require('swagger-express-mw');
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./api/swagger/api.yaml');
// const modules = require("./module/module.js");
// const verifyToken = require("/home/voltuswave4/Desktop/Tempo/Room-Tempo/swagger/module/user/tokenVerify.js")

// console.log("swaggerDocument", swaggerDocument["host"])

// if (process.env.swaggerHostName) {
//   swaggerDocument["host"] = process.env.swaggerHostName
// }
// console.log("swaggerDocument", swaggerDocument["host"])
//  const swaggerddd = require('./api/swagger/swagger.yaml')

// var app = require('express')();

// app.use('/openApiUI', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// module.exports = app; 
// for testing
// const express = require('express');
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// var config = {
//   appRoot: __dirname 
//   required config
// };

// let dbConfig = (() => {
//   let p = 
//   return p;
// })();
// let dbConfig = {
//   sql: {
//     user: process.env.sqluser || 'sa',
//     password: process.env.sqlpassword || 'Apple#123',
//     database: process.env.sqldatabase || 'Hosttempo_Dev',
//     server: process.env.sqlserver || 'roomtempoqa.ccb0buccqamy.ap-south-1.rds.amazonaws.com',
//     port: 1403,
//     pool: {
//       max: 10,
//       min: 0,
//       idleTimeoutMillis: 30000
//     },
//     driver: 'msnodesqlv8',
//     options: {
//       encrypt: false
//     }
//   }
// }


// console.log("db config", dbConfig);
// console.log(config.get("password"))

// require('./core/core.js')(dbConfig)
//   .then(async (config) => {
//     modules.forEach((module) => {
//       app.post("/getReservationId", (req, res) => {


//         console.log(apiHeaders)
//         let getVerify = verifyToken(apiHeaders)
//         console.log("userDetails", getVerify)

//         if (getVerify !== "Invalid Token") {
//           let params = req.body;
//           console.log(apiHeaders.token)
//           console.log("get reservation");
//           module.callback(config, getVerify, params, (err, response) => {
//             if (err) {
//               res.send(err)
//             }
//             res.send(response)
//           })
//         }
//         else {
//           res.send("invalidToken")
//         }

//       })
//     })
//   })





// SwaggerExpress.create(config, function (err, swaggerExpress) {
//   if (err) { throw err; }

//   install middleware
//   swaggerExpress.register(app);

//   var port = process.env.swaggerPort || 5001;
//   app.listen(port);

//   if (swaggerExpress.runner.swagger.paths['/hello']) {
//     console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
//   }
// });
const getIP = require('satelize')

getIP.satelize({ ip: '172.16.137.149' }, function (err, payload) {
  console.log("payload", payload)
})