import { MongoClient } from "mongodb";

const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const port = Number(process.env.PORT) | 3000;
const mongoDbUrl = process.env.MONGOD_URL;

async function start() {
    try{

        const app = express();
        const mongo = await MongoClient.connect(mongoDbUrl)

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

        // start the server
        app.listen(port, ()=>{
            console.log('server is running on port {' + port + '}')
        })


    } catch(error){
        console.log(error)
    }
}

start()