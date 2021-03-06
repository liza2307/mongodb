const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/");
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("money").collection("Deposit");
    app.listen(3002, function(){
        console.log("Please wait...");
    }); 
});
 
app.get("/api/users", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, user){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
   
app.post("/api/users", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);

    
    const userBet = req.body.Bet;
    const userTitle = req.body.Title;
    const userPeriod = req.body.Period;
    const userBank = req.body.Bank;
    const user = { Bet: userBet,Title:userTitle,Period:userPeriod,Bank:userBank};
       
    const collection = req.app.locals.collection;
    collection.insertOne(user, function(err, result){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.delete("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let user = result.value;
        res.send(user);
    });
});
   
app.put("/api/users", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const userBet = req.body.Bet;
    const userTitle = req.body.Title;
    const userPeriod = req.body.Period;
    const userBank = req.body.Bank;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: { Bet: userBet,Title:userTitle,Period:userPeriod,Bank:userBank}},
         {returnDocument: "after" },function(err, result){
               
        if(err) return console.log(err);     
        const user = result.value;
        res.send(user);
    });
});
 
// ???????????????????????? ???????????????????? ???????????? ?????????????????? (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});