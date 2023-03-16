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

const mssql = require('mssql');
let moment = require('moment');
let jwt = require("jsonwebtoken");
let crypto = require('crypto');

const sqlconfig = {
    server: process.env.sqlserver || '192.168.1.33',
    user: process.env.sqluser || 'sa',
    password: process.env.sqlpassword || 'Apple#123',
    // password: 'Apple#123',
    database: process.env.sqldatabase || 'RoomTempo_Dev',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        appName: "cloud-roomtemp0-Rajendra"
    },
    connectionTimeout: 50000,
    requestTimeout: 50000,
};

if (process.env.port) {
    sqlconfig.port = process.env.port;
    sqlconfig.port = parseInt(sqlconfig.port);
}

console.log("config = " + typeof sqlconfig.port)
console.log(sqlconfig)

mssql.connect(sqlconfig).then((_pool) => {
    console.log("MSSQLSERVER Connection Established..!", sqlconfig.database);
});

mssql.on('error', err => {
    // ... error handler
    console.log(err)
});
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
    getReservations: getReservations
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getReservations(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

    var request1 = new mssql.Request();
    request1.input('AuthenticationKey', mssql.NVarChar, req.swagger.params['body'].value.Token);

    request1.execute("GetUserByAuthenticationKey", (err, resdata) => {
        if (err) {
            console.log("GetUserByAuthenticationKey", err)
            res.json([{ message: "error in Authentication", data: null }]);
            return
        }
        if (resdata && resdata.recordsets && resdata.recordsets[0] && resdata.recordsets[0].length > 0) {


            console.log(resdata.recordsets[0])
            console.log(req.swagger.params['body'].value)
            // res.json(resdata.recordsets[0]);
            getReservationsByUser(resdata.recordsets[0][0], req.swagger.params['body'].value).then(reservationData => {
                if (resdata.recordsets[0][0].UserSecretKey) {


                    if (reservationData && reservationData.message) {
                        res.json(reservationData);

                    } else {
                        var reservationObjList = []
                        for (let resobj of reservationData.data) {
                            reservationObjList.push({
                                "ReservationId": resobj.ConfirmationNumber,
                                "GuestFirstName": resobj.GuestFirstName,
                                "GuestLastName": resobj.GuestLastName,
                                "PhoneNumber": resobj.PhoneNumber,
                                "Email": resobj.Email,
                                "City": resobj.CityName,
                                "State": resobj.StateName,
                                "Country": resobj.CountryName,
                                "Persons": resobj.Persons,
                                "NumberOfAdults": resobj.NumberOfAdults,
                                "NumberOfChildren": resobj.NumberOfChildren,
                                "PropertyName": resobj.PropertyName,
                                "propertyNickName": resobj.propertyNickName,
                                "UnitName": resobj.UnitName,
                                "UnitNickName": resobj.UnitNickName,
                                "UnitTypeName": resobj.UnitTypeName,
                                "UnitClassName": resobj.UnitClassName,
                                "Arrival": resobj.originalStartDate,
                                "Departure": resobj.originalEndDate,
                                "Nights": resobj.Nights,
                                "UnitCharges": resobj.UnitCharges,
                                "CleaningFees": resobj.CleaningFees,
                                "Taxes": resobj.Taxes,
                                "OtherCharges": resobj.OtherCharges,
                                "TotalAmount": resobj.TotalRate,
                                "DueAmount": resobj.BalanceRate,
                                "Payments": resobj.Payments,
                                "Last4": resobj.Last4,
                                "ExpiryDate": resobj.ExpiryDate,
                                "Tags": resobj.Tag,
                                "StatusName": resobj.StatusName,
                                "CrsName": resobj.CrsName,
                                "CrsConfirmationNumber": resobj.CrsConfirmationNumber,
                                "SourceName": resobj.SourceName,
                                "SourceConfirmationNumber": resobj.SourceConfirmationNumber,
                                "SubSourceName": resobj.SubSourceName,
                                "SubSourceConfirmationNumber": resobj.SubSourceConfNumber,
                                "DateBooked": resobj.DateBooked,
                                "ClientConfirmationNumber": resobj.Ext_ConfirmationNumber,
                                "Notes": resobj.Notes,
                            })

                        }

                        let algorithm = 'aes-128-ecb',
                            password = resdata.recordsets[0][0].UserSecretKey;

                        console.log(password)

                        var cipher = crypto.createCipher(algorithm, password)
                        var crypted = cipher.update(JSON.stringify(reservationObjList), 'utf8', 'hex')
                        crypted += cipher.final('hex');

                        var decipher = crypto.createDecipher(algorithm, password)
                        var dec = decipher.update(crypted, 'hex', 'utf8')
                        dec += decipher.final('utf8');

                        // console.log(crypted);
                        console.log(dec);

                        res.json(crypted);
                    }
                } else {
                    res.json([{ message: "error in Authentication", data: null }]);
                }
            })

        } else {
            res.json([{ message: "error in Authentication", data: null }]);
        }
    })

}

let getReservationsByUser = async function (userData, filterData) {
    return new Promise((resolve, reject) => {
        var request = new mssql.Request();

        const SearchTextTable = new mssql.Table();
        let SearchText = []
        SearchTextTable.columns.add("searchText", mssql.NVarChar);
        if (SearchText && SearchText.length > 0) {
            for (let SearchText of SearchText) {
                SearchTextTable.rows.add(SearchText)
            }
        } else {
            SearchTextTable.rows.add(null);
        }


        const filterColumns = new mssql.Table();
        filterColumns.columns.add("ColumnName", mssql.NVarChar);
        filterColumns.columns.add("ColumnText", mssql.NVarChar);

        filterColumns.columns.add("StartDate", mssql.NVarChar);
        filterColumns.columns.add("EndDate", mssql.NVarChar);

        filterColumns.rows.add('PropertyId', "", null, null);
        filterColumns.rows.add('SourceId', "", null, null);
        filterColumns.rows.add('FilterTags', "", null, null);
        filterColumns.rows.add('UnitClassId', "", null, null);
        filterColumns.rows.add('UnitTypeId', "", null, null);
        filterColumns.rows.add('UnitId', "", null, null);
        filterColumns.rows.add('StatusId', "", null, null);
        filterColumns.rows.add('Oversell', 0, "", null);
        filterColumns.rows.add('ConfirmationNumber', filterData.ReservationId ? filterData.ReservationId : "", null, null);
        filterColumns.rows.add('PropertyNickName', filterData.PropertyNickName ? filterData.PropertyNickName : "", null, null);
        filterColumns.rows.add('StayDate', "", filterData && filterData.ArrivalDate ? moment(filterData.ArrivalDate).format("YYYY-MM-DD") : null, filterData && filterData.DepartureDate ? moment(filterData.DepartureDate).format("YYYY-MM-DD") : null);
        filterColumns.rows.add('DateBooked', "", filterData && filterData.BookedOnStartDate ? moment(filterData.BookedOnStartDate).format("YYYY-MM-DD") : null, filterData && filterData.BookedOnEndDate ? moment(filterData.BookedOnEndDate).format("YYYY-MM-DD") : null);
        // filterColumns.rows.add('ConfirmationNumber', req.swagger.params['clientId'].value, "", null);

        request.input('ClientId', mssql.Int, userData.ClientId);
        request.input('UserId', mssql.Int, userData.UserId);
        request.input('ViewListId', mssql.Int, -1);
        request.input('userDate', mssql.DateTime2, moment.utc().format("YYYY-MM-DD"));
        request.input('FilterColumns', filterColumns);
        request.input('SearchItem', SearchTextTable);
        request.input('SortOrder', mssql.NVarChar, null);
        request.input('SortBy', mssql.NVarChar, null);

        // request.input('PageNo', mssql.INT, 1);
        // request.input('ItemsPerPage', mssql.Int, null);



        request.execute("GetReservations_ExportToExcel", (err, resdata) => {
            if (err) {
                // res.json("error in getting the reservation", err);
                return resolve({ message: "error in getting the reservation", data: null })
            }
            console.log(resdata.recordsets[1].length)
            if (resdata && resdata.recordsets && resdata.recordsets[1] && resdata.recordsets[1].length > 0) {

                // res.json("success");
                resolve({ message: null, data: resdata.recordsets[1] })
            } else {
                // res.json("error in getting the list no data from db");
                resolve({ message: "error in getting the reservation(s)", data: null })
            }
        })
    })
}
