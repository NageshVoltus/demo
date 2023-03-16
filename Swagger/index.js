const jwt = require('jsonwebtoken');

const payload = {
  user_id: 1234,
  email: 'user@example.com'
};

const secretKey = 'Sam#123';

const token = jwt.sign(payload, secretKey);
console.log("token", token);
const tt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoZWFkZXIiOnsiVXNlcklkIjo5LCJFbWFpbElkIjoic2NyZWVuaWZ5MTIzQGdtYWlsLmNvbSIsIlVzZXJDbGllbnRJZCI6NX0sImlhdCI6MTY3NzUwNTg5MywiZXhwIjoxNjc3OTM3ODkzfQ.puZ9a5vJEQmKftwZuWfU2Ako0wRipoQvBtHH9mTwQoA"



jwt.verify(tt,secretKey, (err, decoded) => {
    if (err) {
      console.error(err);

    } else {
      console.log(decoded);
      // console.log(decoded.user_id)
    }
  });