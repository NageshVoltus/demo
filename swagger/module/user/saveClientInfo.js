const mssql = require('mssql');


module.exports = (config, getVerify, params, callback) => {
    // console.log(getVerify)
    const requestParams = config.dbwrapper.getNewRequest();
    // requestParams.input('ReservationId', mssql.INT, params.ReservationId);
    // requestParams.input('UserId', mssql.INT, getVerify.userid);
    requestParams.execute('GetReservationswithoutfolio_ById', (err, result) => {
        if (err) {
            console.log(err)
            callback(err, undefined)
        }
        callback(undefined, result.recordsets[0][0])

    })

}
//17693
//65