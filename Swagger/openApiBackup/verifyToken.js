const jwt = require("jsonwebtoken")
require('dotenv').config()
module.exports = (apiHeaders) => {
    let user_details;
    // console.log("secreteKey", process.env.openApiTokenGeneratingSceretKey)
    jwt.verify(apiHeaders.token, process.env.openApiTokenGeneratingSceretKey, (err, decoded) => {
        // console.log(tt.authorization)
        if (err) {
            user_details = "Invalid Token"

        } else {
            // console.log("decoded.userid", decoded.userid)
            user_details = decoded

        }
    });
    return user_details
}