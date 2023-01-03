const express = require("express");
const CONFIG = require('./config');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = express();
const http = require('http').Server(app);
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const api = require('./api.js')

app.use(bodyParser.json());

const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: CONFIG.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: CONFIG.SESSION_URL
    })
}));

app.use(express.static(__dirname + "/public"));

app.get('/is_authenicated', function (req, res, next) {
    if (req.session.user) {
        const id = new objectId(req.session.user['id']);
        mongoClient.connect(CONFIG.USER_URL, function (err, db) {
            db.collection("users")
                .findOne({ _id: id }, function (err, user) {
                    db.close();
                    res.json({ name: user.username });
                });

        });
    } else {
        next();
    }
});

app.post('/login', function (req, res, next) {
    try {
        if (req.session.user) {
            return res.redirect('/');
        }

        const form = new formidable.IncomingForm();

        form.parse(req);
        let userObj = {};

        form.on('field', function (field, value) {
            userObj[field] = value;
        });
        form.on('end', function () {
            if (!userObj.password || !userObj.email) {
                return res.status(400).json({ message: 'Érror' });
            }

            api.checkUser(userObj)
                .then(function (user) {
                    if (user) {
                        req.session.user = { id: user._id, name: user.name };
                        res.json({ name: user.username });
                    } else {
                        next(error);
                    }
                })
                .catch(function (error) {
                    next(error);
                })
        });
    } catch (e) {
        res.status(400).json({ message: e });
    }
});

const isEmailValid = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
    );
}

const isNameValid = (name) => {
    return /^(?=.*[A-Za-z])[A-Za-z\d]{2,15}$/.test(
        name
    )
}

const isPasswordValid = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(
        password
    )
}

app.post('/registration', function (req, res, next) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req);
        let userObj = {};

        form.on('field', function (field, value) {
            userObj[field] = value;
        });

        form.on('end', function () {
            if (!isPasswordValid(userObj.password)) return res.status(400).json({ message: 'Érror pass' });
            if (!isEmailValid(userObj.email)) return res.status(400).json({ message: 'Érror email' });
            if (!isNameValid(userObj.name)) return res.status(400).json({ message: 'Érror name' });

            api.createUser(userObj)
                .then(function ({_doc}) {
                    console.log("User created");
                    req.session.user = { id: _doc._id, name: _doc.name };
                    res.json({ name: _doc.username });
                })
                .catch(function (err) {
                    if (err.toJSON().code == 11000) {
                        res.status(500).send("This email already exist");
                    }
                });
        });
    } catch (e) {
        res.status(400).json({ message: e });
    }
});

app.post('/logout', function (req, res, next) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('/');
    }
});

app.get("/admin", isAdmin, function (req, res) {

    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        db.collection("posts")
            .find({})
            .toArray(function (err, posts) {
                res.send(posts);
                db.close();
            });
    });
});

function isAdmin(req, res, next) {
    if (req.session.user) {
        const id = new objectId(req.session.user['id']);

        mongoClient.connect(CONFIG.USER_URL, function (err, db) {
            db.collection("users")
                .findOne({ _id: id }, function (err, user) {
                    db.close();
                    if (user['role'] == 'admin') {
                        next();
                    } else {
                        res.status(400).send();
                    }
                });

        });
    } else {
        res.status(400).send();
    }
}

// blog posts
app.get("/api/posts", function (req, res) {
    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        db.collection("posts")
            .find({}, {
                name: 1,
                description: 1,
                createDate: 1,
                updateDate: 1,
                categories: 1
            })
            .toArray(function (err, posts) {
                res.send(posts);
                db.close();
            });
    });
});

//categories
app.get("/api/categories", function (req, res) {
    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        db.collection("posts").distinct('categories')
            .then(function (val) {
                res.send(val);
                db.close();
            });
    });
});

//get current post
app.get("/api/posts/:id", function (req, res) {
    const id = new objectId(req.params.id);
    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        db.collection("posts").findOne({ _id: id }, function (err, post) {

            if (err)
                return res.status(400).send();

            res.send(post);
            db.close();
        });
    });
});

//add post
app.post("/api/posts", isAdmin, function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        let fileName;
        let postObj = {};

        form.parse(req)

        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/public/img/' + file.name;
            fileName = file.name;
        });

        form.on('field', function (field, value) {
            postObj[field] = value;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

        form.on('end', function () {
            const re = /\s*,\s*/;
            const categories = postObj.categories.split(re);

            const post = {
                name: postObj.name,
                description: postObj.description,
                text: postObj.text,
                createDate: postObj.createDate,
                file: fileName,
                categories: categories
            };

            mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
                db.collection("posts").insertOne(post, function (err, result) {
                    if (err)
                        return res.status(400).send();
                    res.send(post);
                    db.close();
                });
            });
        });
    } catch (e) {
        res.status(400).json({ message: e });
    }
});

//delete post
app.delete("/api/posts/:id", isAdmin, function (req, res) {
    const id = new objectId(req.params.id);
    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        db.collection("posts").findOneAndDelete({ _id: id }, function (err, result) {
            if (err)
                return res.status(400).send();

            const post = result.value;
            res.send(post);
            db.close();
        });
    });
});

//change post
app.put("/api/posts", isAdmin, function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        let fileName;
        let postObj = {};

        form.parse(req);

        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/public/img/' + file.name;
            fileName = file.name;
        });

        form.on('field', function (field, value) {
            postObj[field] = value;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

        form.on('end', function () {
            const id = new objectId(postObj.id);
            const re = /\s*,\s*/;
            const categories = postObj.categories.split(re);

            let updatedFields = {
                ...postObj,
                categories
            }

            if (fileName) {
                updatedFields.file = fileName
            }

            mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
                db.collection("posts").findOneAndUpdate({ _id: id },
                    {
                        $set: updatedFields
                    },
                    {
                        returnOriginal: false
                    }, function (err, result) {
                        if (err)
                            return res.status(400).send();

                        const post = result.value;
                        res.send(post);
                        db.close();
                    });
            });
        });
    } catch (e) {
        res.status(400).json({ message: e });
    }
});

app.post("/api/contact", function (req, res) {
    if (!req.body)
        return res.sendStatus(400);

    const email = req.body.from;
    const message = req.body.message;
    const current_message = { email: email, message: message };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aleksandrvasilev666@gmail.com',
            pass: ''
        }
    });

    const mailOptions = {
        from: 'aleksandrvasilev666@gmail.com',
        to: 'aleksandr_vasilev1989@list.ru',
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

app.post("/api/search", function (req, res) {
    if (!req.body)
        return res.sendStatus(400);

    const currentQuery = req.body.query;
    const regex = new RegExp(currentQuery, 'i');

    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        if (err)
            throw err;
        db.collection("posts")
            .find({ name: { $regex: regex } }, {
                name: 1,
                description: 1
            })
            .toArray(function (err, result) {
                if (err)
                    throw err;
                res.send(result);
                db.close();
            });
    });
});

//find by category
app.post("/api/by_category", function (req, res) {
    if (!req.body)
        return res.sendStatus(400);

    const currentQuery = req.body.query;
    const re = new RegExp(currentQuery);

    mongoClient.connect(CONFIG.POSTS_URL, function (err, db) {
        if (err)
            throw err;
        const query = { categories: re };
        db.collection("posts")
            .find(query, {
                name: 1,
                description: 1,
                createDate: 1,
                updateDate: 1,
                categories: 1
            })
            .toArray(function (err, result) {
                if (err)
                    throw err;
                console.log(result);
                res.send(result);
                db.close();
            });
    });
});

// app.listen(80)

mongoose.connect(CONFIG.USER_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', function (err) {
    if (err) {
        console.log("Error Opening the DB Connection: ", err);
        return;
    }

    http.listen(CONFIG.PORT, function () {
        console.log("run!");
    });
});

process.on('uncaughtException', (err, origin) => {
    console.log(
       `Caught exception: ${err}\n` +
       `Exception origin: ${origin}`,
     );
   });