import { MongoClient } from "mongodb";
const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config()

const port = Number(process.env.PORT) | 3000;
const mongoDbUri = process.env.MONGODB_URI;

async function start() {
    try{

        const app = express();
        const mongo = new MongoClient(mongoDbUri);

        await mongo.connect();
        app.db = mongo.db();

        // cors
        app.use(cors())

        //body parser
        app.use(body.json({
            limit: '500kb'
        }))

        // Routes 
        app.use('/api/profile', require('./routes/profile'));
        app.use('/api/jwt', require('./routes/jwt'))
        app.use('/api/login', require('./routes/login'))
        app.use('/api/logout', require('./routes/logout'))

        // check the server is running
        app.get("/", (req, res)=>{
            res.status(200).json({message: `the server is up and running on port ${port}`})
        })

        // start the server, only if it is connected to mongodb
        app.listen(port, ()=>{
            console.log('server is running on port {' + port + '}')
        })


    } catch(error){
        console.log(error)
    }
}

start()