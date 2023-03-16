const getReservationByIdSwagger = require('./user/getReservationByIdSwagger')
const sendAvailability=require('./user/sendAvailability')
const saveClientConfirmationNumber = require('./user/saveClientInfo')
const addUnitInfoDetails = require('./user/saveClientInfo')
const updateMessageId = require('./user/updateApiSendMessage')
module.exports = [
    { key: "getReservationByIdSwagger", callback: getReservationByIdSwagger, method: "get" },
    { key: "sendAvailability", callback: sendAvailability, method: "post" },
    { key: "saveClientConfirmationNumber", callback: saveClientConfirmationNumber, method: "post" },
    { key: "addUnitInfoDetails", callback: addUnitInfoDetails, method: "post" },
    { key: "updateMessageId", callback: updateMessageId, method: "post" }
]