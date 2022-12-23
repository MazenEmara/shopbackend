const Db = process.env.ATLAS_URI;
const express = require("express");
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

module.exports.postTicket = function (req, response) {
    let db_connect = dbo.getDb();
    var myobj =req.body
       myobj=myobj.map(obj=>({
            matchNumber: obj.matchNumber,
            roundNumber: obj.roundNumber,
            dateUtc: obj.dateUtc,
            location: obj.location,
            availability: {
                category1: {
                    count: obj.availability.category1.count,
                    price: obj.availability.category1.price,
                    Pending:0
                },
                category2: {
                    count: obj.availability.category2.count,
                    price: obj.availability.category2.price,
                    Pending:0
                },
                category3: {
                    count: obj.availability.category3.count,
                    price: obj.availability.category3.price,
                    Pending:0
                }, 
            },
            homeTeam: obj.homeTeam,
            awayTeam: obj.awayTeam,
            group:obj.group,
        }));
    db_connect.collection("ShopMicroservice").insertMany(myobj, function (err, res) {
    if (err) throw err;
        response.json(res);
    });

    

}

// This section will help you get a list of all the records.
module.exports.getAllTickets = function (req, res) {
    let db_connect = dbo.getDb("WorldCup");
    db_connect
    .collection("ShopMicroservice")
    .find({})
    .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
};


// This section will help you get a single record by id
module.exports.getTicket = function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { matchNumber: Number(req.params.matchNumber)};
    db_connect
    .collection("ShopMicroservice")
    .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
};
   // This section will help you update a record by id.
module.exports.updateTicket = function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { matchNumber: Number(req.params.matchNumber)};
    let newvalues = {
        "$inc" : { 
            "availability.category1.Pending" : -req.body.availability.category1.count,
            "availability.category2.Pending" : -req.body.availability.category2.count,
            "availability.category3.Pending" : -req.body.availability.category3.count 
        }
    };
    db_connect
    .collection("ShopMicroservice")
    .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("Quantity updated");
        response.json(res);
    });
};

module.exports.updatePending = function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { matchNumber: Number(req.params.matchNumber)};
    let newvalues = {
        "$inc" : { 
            "availability.category1.Pending" : req.body.availability.category1.count,
            "availability.category2.Pending" : req.body.availability.category2.count,
            "availability.category3.Pending" : req.body.availability.category3.count 
        }
    };
    db_connect
    .collection("ShopMicroservice")
    .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("Quantity updated");
        response.json(res);
    });
};

module.exports.updateReserved = function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { matchNumber: Number(req.params.matchNumber)};
    let newvalues = {
        "$inc" : { 
            "availability.category1.Pending" : -req.body.availability.category1.count,
            "availability.category1.count" : -req.body.availability.category1.count,
            "availability.category2.Pending" : -req.body.availability.category2.count,
            "availability.category2.count" : -req.body.availability.category2.count,
            "availability.category3.Pending" : -req.body.availability.category3.count,
            "availability.category3.count" : -req.body.availability.category3.count
        },
    };
    db_connect
    .collection("ShopMicroservice")
    .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("Quantity updated");
        response.json(res);
    });
};
    
   // This section will help you delete a record
module.exports.deleteTicket = function (req, response){
    let db_connect = dbo.getDb();
    let myquery = { matchNumber: Number(req.params.matchNumber)};
    db_connect.collection("ShopMicroservice").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("List deleted");
    response.json(obj);
    });
};

