const mssql = require('mssql');
const updateMessageId = require('./updateApiSendMessage')

module.exports = (config, getVerify, params, callback) => {
    // console.log(getVerify)
    let messsageParams = {
        MessageId: params.messageId,
        ReservationId: params.ReservationId,
        SyncStatusId: 2,
        ClientResponse: params,
        ClientConfirmationNumber: null
    }
    updateMessageId(config, getVerify, messsageParams, (err, response) => {
        if (err) {
            console.log(err)
            callback(err, undefined)
        }
        else {
            const requestParams = config.dbwrapper.getNewRequest();
            requestParams.input('ReservationId', mssql.INT, params.ReservationId);
            requestParams.input('UserId', mssql.INT, getVerify.UserId);
            requestParams.execute('GetReservationswithoutfolio_ById', (err, result) => {
                if (err) {
                    console.log(err)
                    callback(err, undefined)
                }

                else {
                    callback(undefined, result.recordsets[0][0])
                    let messsageParams = {
                        MessageId: params.messageId,
                        ReservationId: params.ReservationId,
                        SyncStatusId: 3,
                        ClientResponse: params,
                        ClientConfirmationNumber: null
                    }
                    updateMessageId(config, getVerify, messsageParams, (err, response) => {
                        if (err) {
                            console.log(err)
                            // callback(err, undefined)
                        }
                        // else{
                        //     callback(undefined,response);
                        // }
                    })
                }
            })
        }
    })


}
//17693
//65