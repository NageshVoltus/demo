const getReservationByIdSwagger = require('./user/getReservationByIdSwagger')
const updateApiSendMessage = require('./user/updateApiSendMessage')

module.exports = [
    { key: "getReservationByIdSwagger", callback: getReservationByIdSwagger, method: "get" },
    { key: "updateApiSendMessage", callback: updateApiSendMessage, method: "get" }
]