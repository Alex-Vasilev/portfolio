var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/postsdb";
var formidable = require('formidable');
//var fs = require('fs');
var api = require('./api.js')

var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'i need more beers',
  resave: false,
  saveUninitialized: false,
  // Место хранения можно выбрать из множества вариантов, это и БД и файлы и Memcached.
  store: new MongoStore({ 
    url: 'mongodb://localhost:27017/store',
  })
}))

 
app.use(express.static(__dirname + "/public"));


app.post('/login', function (req, res, next) {
    if (req.session.user)
        return res.redirect('/')

    api.checkUser(req.body)
            .then(function (user) {
                if (user) {
                    req.session.user = {id: user._id, name: user.name}
                    res.redirect('/')
                } else {
                    return next(error)
                }
            })
            .catch(function (error) {
                return next(error)
            })

});
 
app.post('/', function (req, res, next) {

    var form = new formidable.IncomingForm();

    form.parse(req);
    var userObj = {};

    form.on('field', function (field, value) {
//        console.log(field, value);
        userObj[field] = value;
    });

    form.on('end', function () {
        api.createUser(userObj)
                .then(function (result) {
                    console.log("User created");
                })
                .catch(function (err) {
                    console.log(err);
                    if (err.toJSON().code == 11000) {
                        res.status(500).send("This email already exist");
                    }
                });
    });
});
 
app.post('/logout', function (req, res, next) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/');
    }
});


app.get('/', function (req, res, next) {
    if (req.session.user) {
        var data = {
            title: 'Express',
            user: req.session.user
        };
        res.render('index', data);
    } else {
        var data = {
            title: 'Express',
        };
        res.render('index', data);
    }
});

//authorization
//var basicAuth = require('basic-auth');
//
//  function unauthorized(res) {
//    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//    return res.send(401);
//  };
//
//var auth = function (req, res, next) {
// 
//  var user = basicAuth(req);
// 
//  // Если пользователь не ввёл пароль или логин, снова показать форму.
//  if (!user || !user.name || !user.pass) {
//    return unauthorized(res);
//  };
//
//  // Если логин admin, а пароль superChargePassword перейти к
//  // следующему middleware.
//  if (user.name === 'admin' && user.pass === '12345') {
//    return next();
//  } else {
//    return unauthorized(res);
//  };
// 
//  return unauthorized(res);
//};
// 
//app.use('/admin', auth);
//
//app.get("/admin", function(req, res){
//      
//    mongoClient.connect(url, function(err, db){
//        db.collection("posts")
//        .find({})
//        .toArray(function(err, posts){
//            res.send(posts);
//            console.log(posts);
//            db.close();
//        });
//    });
//});
//
//app.get("/logout", function(req, res){
//      unauthorized(res);
////      return res.redirect('/');
//});

// blog posts
app.get("/api/posts", function(req, res){
    mongoClient.connect(url, function(err, db){
        db.collection("posts")
        .find({}, { name: 1, 
                    description: 1, 
                    createDate: 1, 
                    updateDate: 1, 
                    categories: 1})
        .toArray(function(err, posts){
            res.send(posts);
            console.log(posts);
            db.close();
        });
    });
});

//categories
app.get("/api/categories", function(req, res){
    mongoClient.connect(url, function(err, db){
        db.collection("posts").distinct('categories')
        .then(function(val){
            res.send(val);
            console.log(val);
            db.close();
        });
    });
});

//get current post
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

//add post
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
        
        console.log(postObj.categories);
        var re = /\s*,\s*/;
        var categories = postObj.categories.split(re);
        
        var post = {
            name: postObj.name,
            description: postObj.description,
            text: postObj.text,
            createDate: postObj.createDate,
            file: fileName,
            categories: categories
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

//delete post
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

//change post
app.put("/api/posts", jsonParser, function(req, res){
    
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
        var id = new objectId(postObj.id);
        var name = postObj.name;
        var description = postObj.description;
        var text = postObj.text;
        var updateDate = postObj.updateDate;
        var createDate = postObj.createDate;
        var re = /\s*,\s*/;
        var categories = postObj.categories.split(re);
//        var categories = postObj.categories;
       
        mongoClient.connect(url, function (err, db) {
            db.collection("posts").findOneAndUpdate({_id: id}, 
            {$set: {
                    name: name, 
                    description: description,
                    text: text,
                    file: fileName,
                    updateDate: updateDate,
                    createDate: createDate,
                    categories: categories
                }
            },
            {
                returnOriginal: false
            }, function (err, result) {
                if (err)
                    return res.status(400).send();

                var post = result.value;
                res.send(post);
                console.log(post);
                db.close();
            });
        });
    });
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
//            res.send(error);
            console.log(error);
        } else {
            res.send(current_message);
            console.log('Email sent: ' + info.response);
        }
    });
});

//search
app.post("/api/search", jsonParser, function(req, res){ 
    if(!req.body) return res.sendStatus(400);
     var currentQuery = req.body.query;
    console.log(currentQuery);
    var re = new RegExp(currentQuery);
    mongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var query = {text: re};
        db.collection("posts")
        .find(query, {name: 1,
                      description: 1})
        .toArray(function (err, result) {
            if (err)
                throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});

//find by category
app.post("/api/by_category", jsonParser, function(req, res){ 
    if(!req.body) return res.sendStatus(400);
     var currentQuery = req.body.query;
    console.log(currentQuery);
    var re = new RegExp(currentQuery);
    mongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var query = {categories: re};
        db.collection("posts")
        .find(query, { name: 1, 
                       description: 1, 
                       createDate: 1, 
                       updateDate: 1, 
                       categories: 1})
        .toArray(function (err, result) {
            if (err)
                throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});
 
app.listen(3000, function(){
    console.log("run!");
});

//app.listen(80)