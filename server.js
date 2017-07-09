var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/postsdb";
var formidable = require('formidable');
//var fs = require('fs');
 
app.use(express.static(__dirname + "/public"));

//authorization
var basicAuth = require('basic-auth');

  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

var auth = function (req, res, next) {
 
  var user = basicAuth(req);
 
  // Если пользователь не ввёл пароль или логин, снова показать форму.
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  // Если логин admin, а пароль superChargePassword перейти к
  // следующему middleware.
  if (user.name === 'admin' && user.pass === '12345') {
    return next();
  } else {
    return unauthorized(res);
  };
 
  return unauthorized(res);
};
 
app.use('/admin', auth);

app.get("/admin", function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("posts").find({}).toArray(function(err, posts){
            res.send(posts);
            console.log(posts);
            db.close();
        });
    });
});

app.get("/logout", function(req, res){
      unauthorized(res);
//      return res.redirect('/');
});

// blog posts
app.get("/api/posts", function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("posts").find({}).toArray(function(err, posts){
            res.send(posts);
            console.log(posts);
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
 
//app.post("/api/posts", jsonParser, function (req, res) {
//     
//    if(!req.body) return res.sendStatus(400);
//     
//    var postName = req.body.name;
//    var postDescription = req.body.description;
//    var post = {name: postName, description: postDescription};
//     
//    mongoClient.connect(url, function(err, db){
//        db.collection("posts").insertOne(post, function(err, result){
//             console.log(result.ops);
//            if(err) return res.status(400).send();
//             
//            res.send(post);
//            db.close();
//        });
//    });
//});


app.post("/api/posts", function (req, res) {
     
    var form = new formidable.IncomingForm();
    var fileName;
    var postObj = {};
    
    form.parse(req);
    
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/public/assets/img/' + file.name;
        fileName = file.name;
    });
    
    form.on('field', function(field, value){
        console.log(field, value);
        postObj[field] = value;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    form.on('end', function() {
        var post = {
            name: postObj.name,
            description: postObj.description,
            file: fileName
        };
        mongoClient.connect(url, function(err, db){
            db.collection("posts").insertOne(post, function(err, result){
                 console.log(result.ops);
                if(err) return res.status(400).send();        
                res.send(post);
                db.close();
            });
        });
    });
});

app.delete("/api/posts/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("posts").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var post = result.value;
            res.send(post);
            db.close();
        });
    });
});

app.put("/api/posts", jsonParser, function(req, res){
    
    var form = new formidable.IncomingForm();
    var fileName;
    var postObj = {};
    
    form.parse(req);
    
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/img/' + file.name;
        fileName = file.name;
    });
    
    form.on('field', function(field, value){
        console.log(field, value);
        postObj[field] = value;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    form.on('end', function() {
        var id = new objectId(postObj.id);
        var name = postObj.name;
        var description = postObj.description;

        mongoClient.connect(url, function (err, db) {
            db.collection("posts").findOneAndUpdate({_id: id}, {$set: {name: name, description: description, file: fileName}},
                    {returnOriginal: false}, function (err, result) {
                if (err)
                    return res.status(400).send();

                var post = result.value;
                res.send(post);
                console.log(post);
                db.close();
            });
        });
    });
    
    
      
//    if(!req.body) return res.sendStatus(400);
//    var id = new objectId(req.body.id);
//    var postName = req.body.name;
//    var postDescription = req.body.description;
//     
//    mongoClient.connect(url, function(err, db){
//        db.collection("posts").findOneAndUpdate({_id: id}, { $set: {name: postName, description: postDescription}},
//             {returnOriginal: false },function(err, result){
//             
//            if(err) return res.status(400).send();
//             
//            var post = result.value;
//            res.send(post);
//            console.log(post);
//            db.close();
//        });
//    });
});

//send mail from contact page

app.post("/api/contact", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
     
    var email = req.body.from;
    var message = req.body.message;
    var current_message = {email: email, message: message};

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: '*'
        }
    });

    var mailOptions = {
        from: 'authuser',
        to: 'current email',
        subject: 'AV',
        text: 'Новое сообщение от: ' + email + '\n\n' + message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.send(current_message);
            console.log('Email sent: ' + info.response);
        }
    });
});
  
app.listen(3000, function(){
    console.log("run!");
});
