"use strict"

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

    app.get("/api/getItems/:sortBy", function(req, res) {
        console.log("Gettings get-Items request with", req.params.sortBy);

        if(req.params.sortBy == "none") {
            database.retrieveAll().then(function(data) {
                res.send(data);
            })
        } else {
            console.log(`Gettings sorted items...`)
            database.retrieveSorted(req.params.sortBy).then(function(data) {
                res.send(data);
            })
        }
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


console.log("Main module loaded...");
console.log("Listening...");