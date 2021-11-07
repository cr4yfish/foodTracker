"use strict"

// imports

    const express = require("express");
    const database = require('./database');
    const path = require("path");
    const app = express();

//


// Setup

    app.set("view-engine", "ejs");
    app.listen(30000);


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

    app.post("/api/sendItem", function(req, res) {
        console.log("Getting send-item POST request");
        const reqBody = req.body;
        console.log(reqBody);

        database.saveItem(reqBody).then(function(data) {
            res.send(data);
        })
    })

//


console.log("Main module loaded...");
console.log("Listening...");