const mssql = require('mssql');


module.exports = (config, getVerify, params, callback) => {
    console.log(params)
    const requestParams = config.dbwrapper.getNewRequest();

    requestParams.input('MessageId', mssql.Int, params.MessageId);
    requestParams.input('ReservationId', mssql.Int, params.ReservationId);
    requestParams.input('SyncStatusId', mssql.Int, params.SyncStatusId);
    requestParams.input('ClientResponse', mssql.NVarChar, JSON.stringify(params.ClientResponse));
    requestParams.input('ClientConfirmationNumber', mssql.NVarChar, params.ClientConfirmationNumber);

    requestParams.execute('UpdateApiSendMessage_log', (err, result) => {
        if (err) {
            console.log(err)
            callback(err, undefined)
        }
        callback(undefined, result)

    })

}
//17693
//65