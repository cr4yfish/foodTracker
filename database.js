const Datastore = require("@seald-io/nedb");

console.log("Database module loaded");
console.log("=============");


var db = {};

db.items = new Datastore({ filename: "./database/items.db", autoload: true});
db.items.loadDatabase();

// functions

function retrieveSorted(sortBy = "none", searchBy = "none") {
    console.log("Retrieve Database endpoint ->");
    return new Promise((resolve, reject) => {

        // needs to be '-1' if sort category is an integer
        let sort = 1;

        /*
        if(sortBy == "count") {
            sort = -1;
        }
        */

        let searchRequest = searchBy;
        // fix searchBy
        if(searchRequest != "none") {
            searchRequest = new RegExp(searchBy, "gi");
        }
        
       


// Database entries

        // dont sort and dont search, basically retrieve all
        if(searchRequest == "none" && sortBy == "none") {
            
            console.log("-> Getting everything");
            db.items.find({}).exec(function(err, docs) {
                if(!err) {
                    resolve(docs)
                } else {
                    console.log(err);
                    reject(err);
                }
            })
        } 

        // sort but dont search  
        else if (searchRequest == "none" && sortBy != "none") {
            console.log("-> Getting sorted");
             
            db.items.find({}).sort( {[sortBy] : sort} ).exec(function(err, docs) {
                if(!err) {
                    resolve(docs)
                } else {
                    console.log(err);
                    reject(err);
                }
            })
        } 

        // dont sort but search
        else if (searchRequest != "none" && sortBy == "none") {
            console.log("-> getting searched")
            db.items.find({name: searchRequest}).exec(function(err, docs) {
                if(!err) {
                    resolve(docs)
                } else {
                    console.log(err);
                    reject(err);
                }
            })
        }

        // sort and search
        else if(searchRequest != "none" && sortBy != "none") {
            console.log("-> getting searched and sorted");
            
            db.items.find({name: searchRequest}).sort( {[sortBy] : sort} ).exec(function(err, docs) {
                if(!err) {
                    resolve(docs)
                } else {
                    console.log(err);
                    reject(err);
                }
            })
        }
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

function updateItem(item) {
    console.log("Updating item:", item.id);

    return new Promise((resolve, reject) => {

        const id = item.id;

        delete item.id

        db.items.update({_id: id}, item, {}, function(err, numReplaced) {
            if(!err) {
                resolve(numReplaced);
            } else {
                console.log(err);
                reject(err);
            }
        })
    })
}

function deleteItem(object) {
    console.log("Delete item:", object.id);

    return new Promise((resolve, reject) => {

        db.items.remove({_id: object.id}, {}, function(err, numRemoved) {
            if(!err) {
                resolve(numRemoved);

                // refresh database
                db.items.persistence.compactDatafile();
                
            } else {
                reject(err);
            }
        })
    })
}

exports.retrieveSorted = retrieveSorted;
exports.retrieveAll = retrieveAll;
exports.saveItem = saveItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;