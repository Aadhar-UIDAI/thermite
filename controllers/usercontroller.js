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
                            user.token = Math.floor(Math.random() * 12151215);
                            console.log(user);
                            res.status(200).json(user);
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
    }

})();