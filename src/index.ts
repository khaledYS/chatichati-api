/**
 * ------------------------------------- IMPORTANT -------------------------------------
 * I started this app with the hope that one day I will deploy it somewhere that 
 * doesn't hurt me physically or mentally, considering netlify, It was the 
 * completly opposite what I thought. All what I though was spring, green world, peace
 * and easy deploying. Nevertheless, I got to spend a whole 2 Days, what I mean by
 * 2 Days is 48 fu**ing hours. I couldn't sleep. Rebuilding my whole code to just 
 * satisfy the netlify stupid serverless functions needs, considering there whole 
 * shit long url to just get to ur api. 
 * EX: api.netlify.app/.netlify/functions/<function-name> .
 * I even came here to delete this because I created new due the serverless functions
 * rules that signfies that should but your "function" in functions dir or change that
 * with some stupid toml configuration that no human on earth can understand it for 
 * what?!!! just because they are stupid enough not to read function way file in 
 * the root dir.
 * Isn't this shameless ? I mean I fucking tried to use redirects to redirect that long 
 * url to some shorty pretty url, but guess what ? it doesn't pass any json body in 
 * the request to the original long url. THIS IS HEART BROKEN. I ended up using the 
 * too long url. I mean, that already took me 60*60 milliseconds to type. Isn't that 
 * too long?! I mean think about it. If had to type that in average for 3 times in a week
 * that's 3*52 * 60*60, which means 561600 millieseconds every year, think about it.
 * If I had to this for about 20 years thats 20*561600 which results in 
 * 11232000 milliseconds wasted on only writing a fucking too long and have the high 
 * percentage that you might misspell the url!!! that's already 52 hours wasted on stupid 
 * netlify shit. I already wasted enough 48 hours on finding solutions for stupid
 * migrations. I am not willing to waste anymore hours!!!
 * Therefore, I decided to NOT delete this file For remembrance and history.
 * THIS CODE will not be updated with the new version coming up. So people shouldn't 
 * Learn, cite or use such "will be old" code.
 * Thanks for your time. Thanks for listening to me expressing my problems.
 * I really appreciate it.
 * Githup: http://github.com/khaledYS
 */


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