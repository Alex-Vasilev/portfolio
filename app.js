var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
 
var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/postsdb";
 
app.use(express.static(__dirname + "/public"));
app.get("/api/posts", function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("posts").find({}).toArray(function(err, posts){
            res.send(posts);
            console.log(posts)
            db.close();
        });
    });
});


app.get("/api/posts/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("posts").findOne({_id: id}, function(err, post){
             
            if(err) return res.status(400).send();
             
            res.send(post);
            db.close();
        });
    });
});
 
app.post("/api/posts", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var postName = req.body.name;
    var postDescription = req.body.description;
    var post = {name: postName, description: postDescription};
     
    mongoClient.connect(url, function(err, db){
        db.collection("posts").insertOne(post, function(err, result){
             console.log(result.ops);
            if(err) return res.status(400).send();
             
            res.send(post);
            db.close();
        });
    });
});

app.delete("/api/posts/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("posts").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
});

//app.put("/api/users", jsonParser, function(req, res){
//      
//    if(!req.body) return res.sendStatus(400);
//    var id = new objectId(req.body.id);
//    var userName = req.body.name;
//    var userAge = req.body.age;
//     
//    mongoClient.connect(url, function(err, db){
//        db.collection("users").findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
//             {returnOriginal: false },function(err, result){
//             
//            if(err) return res.status(400).send();
//             
//            var user = result.value;
//            res.send(user);
//            db.close();
//        });
//    });
//});
  
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});