const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser")

        const app = express();
        // cors
        app.use(cors())
        app.use(cookieParser())
        //body parser
        app.use(body.json({
            limit: '500kb'
        }))


        // check the server is running
        app.get("/", (req, res)=>{
            console.log(req.cookies)
            return res.status(200).json({message: `the server is up and running on 3000 ${3000}`})
        })

        // start the server, only if it is connected to mongodb
        app.listen(3000, ()=>{
            console.log('server is running on 3000 {' + 3000 + '}')
        })
