// const { connect } = require('mssql/msnodesqlv8');
const express = require('express');
const mssql = require('mssql');
const YML = require('yamljs')
const documentjs = YML.load('./api.yaml')
const swaggerui = require("swagger-ui-express")
const app = express();




app.use('/openapi', swaggerui.serve, swaggerui.setup(documentjs))

app.post('/folio', function (req, res) {

    var sql = require("mssql");
    let params = req.headers;
    console.log("header ===", params)
    // config for your database
    var config = {
        user: 'sa',
        password: 'Apple#123',
        database: 'Hosttempo_Dev',
        server: 'roomtempoqa.ccb0buccqamy.ap-south-1.rds.amazonaws.com',
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
    };

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);
        else {
            console.log("Db connected")
        }

        // create Request object res.send(recordset);

        var requestParams = new sql.Request();

        // query to the database and get the records
        // requestParams.input(18134)
        //('ReservationId', mssql.INT, params.ReservationId);
        // requestParams.input(27) 
        requestParams.input('ReservationId', mssql.INT, 18134);
        requestParams.input('UserId', mssql.INT, 27);
        //('UserId', mssql.INT, params.UserId);
        requestParams.execute('GetReservationswithoutfolio_ById', (err, result) => {
            if (err) {
                console.log(err)
                // callback(err, undefined)
            }
            // callback(undefined, result.recordsets[0][0])
            else {
                res.send(result)
            }

        })
    });
});






app.listen(3022, () => {
    console.log("app listening to 3022")
})