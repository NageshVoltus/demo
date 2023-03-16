'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

// const mssql = require('mssql');
let moment = require('moment');
let momentTimezone = require('moment-timezone');

// const sqlconfig = {
//     // server: 'roomtempo.c9p1injyxoz6.ap-south-1.rds.amazonaws.com',
//     // port:1401,
//     server: '192.168.1.33',
//     user: 'sa',
//     password: 'Apple#123',
//     // password: 'Apple#123',
//     database: 'RoomTempo_Dev',
//     pool: {
//         max: 10,
//         min: 0,
//         idleTimeoutMillis: 30000
//     },
//     options: {
//         appName: "abhi-dev-1"
//     }
// };

// mssql.connect(sqlconfig).then((_pool) => {
//     //pool = _pool;
//     console.log("MSSQLSERVER Connection Established..!")
// });

// mssql.on('error', err => {
//     // ... error handler
//     console.log(err)
// });

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
    getReservationById: getReservationById
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getReservationById(req, res) {
    if(req.swagger.params['userToken'].value == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NzY0ODQ0ODJ9.n0o5NBwx6TkZTMUBqwX3XmYKLshekVgdYfXdROquU5U")
{

   // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

    var request = new mssql.Request();
    request.input('ReservationId', mssql.Int, req.swagger.params['reservationId'].value);
    request.input('UserId', mssql.Int, req.swagger.params['userId'].value);
    request.input('ClientId', mssql.Int, req.swagger.params['clientId'].value);
    request.input('BE_Id', mssql.Int, null);


    request.execute("GetReservationDetailById", (err, resData) => {
        if (err) {
            res.json("error in getting the list", err);
        }
        if (resData) {
            // console.log(resData)

            res.json([{ guestInfo: resData.recordsets[2][0], roomInfo: resData.recordsets[3][0] }])
        } else {
            res.json("error in getting the list no data from db");
        }
    })
}
else{
    res.json("invalid user token")
}
}
