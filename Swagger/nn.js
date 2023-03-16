require('dotenv').config()
const express = require("express");
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./swagger.yaml')
const mysql = require("mysql")
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const connection = mysql.createConnection({
    host: "tic-tac-toe.cn48ogcwq1j1.ap-south-1.rds.amazonaws.com",
    user: "Maneesh",
    password: "WeLUzAOViNpMPtKCKZGb",
    database: "newappDB",
    port: 3306
})

app.use('/openapi', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.get("/user", (req, res) => {
    // let token = req.headers
    let query = `select * from HotelData`
    connection.query(query, (err, result, filed) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(result)
            // console.log(token)
        }
    })
});
// app.post("/postdata", (req,res)=>{
//     let user= req.body.userName;
//   let pass = req.body.passWord;
//     let query = `INSERT INTO login_user VALUES (DEFAULT,'${user}','${pass}')`
//     connection.query(query, (error, result, feild) =>{
//     let id =result.insertId
//       if (error) {
//         res.json(error);
//       } else {
//         res.json(result)
//       }
//     })
//     // res.status(200).send({
//     //   status: 'success',
//     //   message:"HELLO",
//     //   insertId:id
//     // });
//   })
app.listen(3333, (req, res) => {
    console.log("port listening to 3333")
})