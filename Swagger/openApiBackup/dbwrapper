// import sqlWrapper from "./sql/sqlWrapper";
///let sqlWrapper = require("./sql/sqlWrapper");

module.exports = (mssqlObj) => {
    return new Promise((res, rej) => {
        res({
            getNewRequest: function () {
                return new mssqlObj.Request();
            }
        });
    });
};