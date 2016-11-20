'use strict';
let apiRoute = require('express').Router();
let User = require('../models/User');
let mongoose = require('mongoose');
let config = require('../config');
let jwt = require('jsonwebtoken');

mongoose.connect(config.dbUri);

apiRoute.post('/signUp', signUp);
apiRoute.post('/authentication', auth);
apiRoute.post('/setUserData', verifyToken, setUserData);
apiRoute.post('/getUserData', verifyToken, getUserData);

function signUp(req, res) {
    let body = req.body;


    if (!(body.userName && body.password && body.name)) {
        res.status(400).json({ message: "Missing fields" }).end();
        return;
    }
    if (!body.userName.match(/^[a-zA-Z0-9_]{3,15}$/)) {
        res.status(400).json({ message: "Invalid 'userName' field. It must be combinations of symbols a-z, A-Z , 0-9 and '_'; and number of symbols should be from 3 to 15." }).end();
        return;
    }
    if (!body.name.match(/^[a-zA-Z]{3,15}$/)) {
        res.status(400).json({ message: "Invalid 'name' field. It must be combinations of symbols a-z or A-Z; and number of symbols should be from 3 to 15." }).end();
        return;
    }
    if (body.password.length < 5) {
        res.status(400).json({ message: "Password too small. Password must be at least 5 symbols." }).end();
        return;
    }

    User.findOne({ userName: body.userName }, function (err, user) {
        if (err) console.log(err);
        if (user) {
            res.status(400).json({ message: "User alredy exists" }).end();
            return;
        }

        let newUser = new User({
            name: body.name,
            userName: body.userName,

        });
        // newUser.password = body.password;
        // newUser.save(function (err) {
        //     if (err) throw err;
        //     console.log("Hello");
        // });

        newUser.hashPassword(body.password, function(err){
            if(err) throw err;
            newUser.save(function(err) {
                if(err) throw err;
            })
        })
        
        jwt.sign({ userName: newUser.userName }, config.secret, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                res.status(400).end(err);
                return;
            }
            res.json({ token: token }).end();
        });

    });

}

function auth(req, res) {
    let body = req.body;
    if (!body.userName || !body.password) {
        res.status(400).json({ message: "Missed field." }).end();
        return;
    }
    User.findOne({ userName: body.userName }, function (err, user) {
        if (err) {
            console.log(err);
            res.status(400).end(err);
        }
        if (!user) {
            res.status(400).json({ message: 'User ' + body.userName + ' not Found.' }).end();
            return;
        }
        //console.log(user.isPasswordValid);
        user.isPasswordValid(body.password, function (err, result) {
            if (err) throw err;
            if (result) {
                jwt.sign({ userName: user.userName }, config.secret, { expiresIn: "7d" }, (err, token) => {
                    if (err) {
                        res.status(400).end(err);
                        return;
                    }
                    res.json({ token: token }).end();
                });

            } else {
                res.status(400).json({ message: 'Authentication failed. Wrong password.' }).end();
            }
        });
        // if (user.isPasswordValidSync(body.password)) {
        //     jwt.sign({ userName: user.userName }, config.secret, { expiresIn: "7d" }, (err, token) => {
        //         if (err) {
        //             res.status(400).end(err);
        //             return;
        //         }
        //         res.json({ token: token }).end();
        //     });

        // } else {
        //     res.status(400).json({ message: 'Authentication failed. Wrong password.' }).end();
        // }
    });
}

function verifyToken(req, res, next) {
    let token = req.body.token;
    jwt.verify(token, config.secret, function (err, decode) {
        if (err) {
            res.status(401).json({ message: 'Authorization failed. Wrong token.' }).end();
            return;
        }
        req.userName = decode.userName;
        next();
    })
}


function setUserData(req, res) {
    let add = req.body.add;
    let rem = req.body.remove;
    if (!add || !rem) {
        res.status(400).json({ message: "request must contain 'add' and 'rem' field" }).end();
        return;
    }
    User.findOne({ userName: req.userName }, function (err, user) {
        if (err) {
            res.status(500).end(err);
            return;
        }

        for (let v in add) {

            let category = v;
            if (add[v] instanceof Array) {
                if (add[v].length === 0) user.addLinkTo(category);
                else
                    add[v].forEach(function (el) {
                        //console.log(category, el);
                        user.addLinkTo(category, el);
                    });
                user.save(function (err) {
                    if (err) res.status(500).end(err);
                });
            }
            else {
                res.status(400).json({ message: "field + add." + v + " must be an array" }).end();
                return;
            }


        }

        for (let v in rem) {
            let category = v;
            console.log(rem);
            if (rem[v] instanceof Array) {
                if (rem[v].length === 0) user.removeLinkIn(category);//remove category
                else
                    rem[v].forEach(function (el) {
                        user.removeLinkIn(category, el);
                    });
                user.save(function (err) {
                    if (err) res.status(500).end(err);
                });

            }
            else {
                res.status(400).json({ message: "field + remove." + v + " must be an array" }).end();
                return;
            }
        }

        res.end();

    });
}

function getUserData(req, res) {
    let output = [];
    User.findOne({ userName: req.userName }, function (err, user) {
        if (err) {
            res.status(500).end(err);
            return;
        }
        user.savedCategories.forEach(function (el) {
            output.push({ categoryName: el.categoryName, links: el.links });
        });
        res.json(output).end();
    })
}

module.exports = apiRoute;