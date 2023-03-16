const mssql = require('mssql');
let moment = require('moment');


module.exports = (config, getVerify, params, callback) => {
    console.log(params)
    const requestParams = config.dbwrapper.getNewRequest();

    let APIUnitAvailable = new mssql.Table();
    APIUnitAvailable.columns.add('UnitId', mssql.Int);
    APIUnitAvailable.columns.add('StartDate', mssql.NVarChar);
    APIUnitAvailable.columns.add('Enddate', mssql.NVarChar);
    APIUnitAvailable.columns.add('IsAvailable', mssql.Bit);
    if (params.unitAvailability.length > 0) {
        for (let t = 0; t < params.unitAvailability.length; t++) {
            let startDate = moment(params.unitAvailability[t].startDate).format("YYYY-MM-DD")
            let EndDate = moment(params.unitAvailability[t].endDate).format("YYYY-MM-DD")
            APIUnitAvailable.rows.add(params.unitAvailability[t].unitId, startDate, EndDate, params.unitAvailability[t].IsAvailable);
            params.selectedUnitAvailability = APIUnitAvailable;
        }
    }
    else {
        APIUnitAvailable.rows.add(null, null, null, null);
        params.selectedUnitAvailability = APIUnitAvailable;
    }

    requestParams.input('unitavailability', params.selectedUnitAvailability);
    requestParams.input('UserId', mssql.Int, getVerify.UserId);

    requestParams.execute('UpdateAvailability_FROMAPI', (err, result) => {
        if (err) {
            console.log(err)
            callback(err, undefined)
        } else {
            callback(undefined, result)
        }

    })

}