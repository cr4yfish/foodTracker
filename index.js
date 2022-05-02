"use strict"

console.log("Main module loaded...");
console.log("=========");

// imports

    const express = require("express");
    const res = require("express/lib/response");
    const database = require('./database');
    const path = require("path");
    const app = express();
    const https = require("https");
    const cors = require('cors');
    const fs = require("fs");
    const fetch = require("node-fetch");
//


// Setup

    // SSL
    var key = fs.readFileSync(__dirname + '/certFiles/private.key');
    var cert = fs.readFileSync(__dirname + '/certFiles/public.cert');

    const options = {
        key: key,
        cert: cert
    };

    //


    // cors
        var corsOptions = {
            origin: "*"
        }

        app.use(cors(corsOptions));
    //

    app.set("view-engine", "ejs");

    // Create HTTPS server.

    var server = https.createServer(options, app);
    server.listen(30001);

    //


    app.use(express.static(path.join(__dirname, "/public")));


    // setup for POST requests
        app.use(express.urlencoded({
            extended: true,
        }))
        app.use(express.json());


    //
//


// public entries
    app.get('/', function(req, res) {
        res.redirect("/home");
    })

    app.get("/home/", function(req, res) {
        res.render("home.ejs", {} );
    })
//

// private entries
    // test
    app.post("/updateProgram", function(req, res) {
        const { exec } = require('child_process');
        exec('./update.sh', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
            res.sendStatus(500);
        } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.sendStatus(200);
        }
        });
    })


    app.get("/api/getItems/:sortBy/:searchBy", function(req, res) {
        console.log("Gettings get-Items request with", req.params.searchBy, "in", req.params.sortBy);

        const sortBy = req.params.sortBy, searchBy = req.params.searchBy;

        // put in info in database API
        database.retrieveSorted(sortBy, searchBy).then(function(data) {
            res.send(data);
        })

        console.log("=========");
        
    })


    app.post("/api/sendItem/:reqState", function(req, res) {
        console.log("Getting send-item POST request:", req.params.reqState);
        const reqBody = req.body;
        console.log("Got this:", reqBody);

        if(req.params.reqState == "add") {
            database.saveItem(reqBody).then(function(data) {
                res.send(data.toString());
            })
        } else if (req.params.reqState == "update") {
            database.updateItem(reqBody).then(function(data) {
                res.send(data.toString());
            })
        }
    })

    app.delete("/api/removeItem", function(req, res) {
        console.log("Got DELETE request");
        const reqBody = req.body;
        console.log("Got this:", reqBody);

        database.deleteItem(reqBody).then(function(data) {
            res.sendStatus(200);
        })
    })

    app.get("/api/convertupc/:upc", async (req, res) => {
        const data = await convertUPC(req.params.upc);
        res.send(data);
    })

//


function convertUPC(upc) {
    return new Promise((resolve, reject) => {

        const API_KEY = "10A3F2C862703FBC";

        const API = `https://eandata.com/feed/?v=3&keycode=${API_KEY}&mode=json&find=${upc}`;
        fetch(API).then(res => res.json()).then(res => {
            resolve(res);
        })
    })
}


console.log("Listening...");