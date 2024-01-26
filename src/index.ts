const {MongoClient} = require("mongodb");
const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const port = Number(process.env.PORT) | 3000;
const mongoDbUrl = process.env.MONGODb_URL;

async function start() {
    try{

        const app = express();
        const mongo = new MongoClient(mongoDbUrl);

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
        mongo.connect(err=>{
            if(err){ console.error(err, "hshshhsh"); return false;}
            // connection to mongo is successful, listen for requests
            app.listen(port, ()=>{
                console.log('server is running on port {' + port + '}')
            })
        })


    } catch(error){
        console.log(error)
    }
}

start()