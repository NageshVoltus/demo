const jwt = require("jsonwebtoken")

const payload = {
    user_id: 1234,
    email: 'user@example.com'
};

const secretKey = "nag"

const token = jwt.sign(payload, secretKey);

console.log(token)
