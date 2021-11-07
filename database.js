const Datastore = require("@seald-io/nedb");

console.log("Database module loaded");
console.log("=============");


var db = {};

db.items = new Datastore({ filename: "./database/items.db", autoload: true});
db.items.loadDatabase();

// functions

function retrieveSorted(sortBy) {
    return new Promise((resolve, reject) => {
        
        db.items.find({}).sort( {[sortBy] : 1} ).exec(function(err, docs) {
            if(!err) {
                resolve(docs)
            } else {
                console.log(err);
                reject(err);
            }
        })
    })
}

function retrieveAll() {
    return new Promise((resolve, reject) => {
        db.items.find({}, function(err, docs) {
            if(!err) {
                resolve(docs);
            } else {
                reject(err);
            }
        })
    })
}

function saveItem(item) {
    return new Promise((resolve, reject) => {

        db.items.insert(item, function(err, savedItems) {
            if(!err) {
                resolve(savedItems);
            } else {
                reject(err);
            }
        })
    })
}

exports.retrieveSorted = retrieveSorted;
exports.retrieveAll = retrieveAll;
exports.saveItem = saveItem;