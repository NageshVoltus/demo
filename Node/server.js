// const express = require('express');
// const app = express();

// app.get('/', function (req, res) {
//     const ipAddress = req.socket.remoteAddress;
//     res.send(ipAddress);
// });

// app.listen(3000, () => console.log(`Server is listening on port 3000`))

// import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';

// console.log(await publicIp()); 


// console.log(await publicIpv6());


// console.log(await publicIpv4());

const os = require('os');
const ifaces = os.networkInterfaces();

let privateIpAddress;
Object.keys(ifaces).forEach((ifname) => {
  ifaces[ifname].forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      privateIpAddress = iface.address;
    }
  });
});

console.log(privateIpAddress);
