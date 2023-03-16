let crypto = require('crypto');

module.exports = {
    decryptData: decryptData
};

function decryptData(req, res) {
    try {
        let algorithm = 'aes-128-ecb'
        var decipher = crypto.createDecipher(algorithm, req.swagger.params['body'].value.SecretKey)
        var dec = decipher.update(req.swagger.params['body'].value.EncyptedData, 'hex', 'utf8')
        dec += decipher.final('utf8');

        console.log(dec);
        res.json(JSON.parse(dec));
    }
    catch (err) {
        console.log(err)
        res.json("error in decrption");
    }

}