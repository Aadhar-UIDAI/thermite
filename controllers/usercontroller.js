(function() {
    var bodyParser = require('body-parser');
    var User = require('../model/usermodel.js');
    module.exports.verification = function (req, res) {
        try {
            var name = req.body.name;
            var email = req.body.username;
            var password = req.body.password;
            User.getUserByEmail(email, function (err, user) {
                if (err) throw err;
                if (user) {
                    console.log("User already exists");
                    res.sendStatus(301);
                }
                else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    });

                    User.createUser(newUser, function (err, user) {
                        if (err) {
                            throw err;
                        }
                        console.log(user);
                    });
                    console.log("User created and can login");
                    res.sendStatus(200);
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    };

    module.exports.login=function (req,res) {
        try {
            var email = req.body.username;
            var password = req.body.password;
            User.getUserByEmail(email, function (err, user) {
                if (err) throw err;
                if (!user) {
                    console.log("Unknown user");
                    res.sendStatus(402);
                }
                else
                {
                    User.comparePassword(password, user.password, function (err, isMatch) {
                        if (err) throw err;
                        if (isMatch) {
                            console.log('User is found');
                            user.token.expiry = new Date().getTime()/1000+86400;
                            user.token.currentToken = Math.floor(Math.random() * 12151215);
                            user.status.online=true;
                            user.save(function (err) {
                                if(err) {
                                    console.error('ERROR!');
                                }
                            });
                            console.log('logged in');
                            console.log(user);
                            var resData={
                                token:user.token.currentToken
                            };
                            res.status(200).json(resData);
                        } else {
                            console.log("Invalid password");
                            res.sendStatus(401);
                        }
                    });
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    };
    module.exports.authenticator=function (req,res) {
        console.log(req.body);
        try {
            var token=req.body.token;
            User.getUserByToken(token, function (err, user) {
                if (err) throw err;
                if (!user) {
                    console.log("Unknown user Kindly login again");
                    res.sendStatus(402);
                }
                else
                {
                    var currentDate = new Date().getTime()/1000;
                    var isOnline=user.status.online;
                    if(isOnline===true)
                    {
                        if(user.token.expiry>currentDate)
                        {
                            res.sendStatus(200);
                        }
                        else
                        {
                            console.log("Token expired, Login again");
                            user.status.online=false;
                            user.save(function (err) {
                                if(err) {
                                    console.error('ERROR!');
                                }
                            });
                            res.sendStatus(404);
                        }
                    }
                    else
                    {
                        res.sendStatus(403);
                    }
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
        res.status(200);
    }
})();