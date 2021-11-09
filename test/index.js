"use strict"

console.log("Main module loaded...");
console.log("=========");

// imports

    const express = require("express");
    const database = require('./database');
    const path = require("path");
    const app = express();

//


// Setup

    app.set("view-engine", "ejs");
    app.listen(30001);


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
        res.send("Hello");
    })

    app.get("/home", function(req, res) {
        res.render("home.ejs", {} );
    })
//

// private entries

    app.post("/updateProgram", function(req, res) {
        const { exec } = require('child_process');
        exec('./update.sh', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
        } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
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

//



console.log("Listening...");