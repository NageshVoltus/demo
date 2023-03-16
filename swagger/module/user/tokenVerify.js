const jwt = require("jsonwebtoken")
require('dotenv').config()
module.exports = (config, apiHeaders) => {
    let user_details
    // console.log("in verify.js", config.openApiTokenGeneratingSceretKey)
    // console.log("in verify.js apiHeaders", apiHeaders)
    // console.log("secreteKey", process.env.openApiTokenGeneratingSceretKey)
    jwt.verify(apiHeaders.token, config.openApiTokenGeneratingSceretKey, (err, decoded) => {
        // console.log(tt.authorization)
        if (err) {
            user_details = "Invalid Token"
            // console.log(config.openApiTokenGeneratingSceretKey)
        } else {
            // console.log("decoded.userid", decoded.userid)
            user_details = decoded
            // console.log("decoded", decoded)

        }
    });
    return user_details
}