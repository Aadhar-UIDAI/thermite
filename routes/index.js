var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');

var User = require('../model/usermodel.js');
var maincontroller=require('../controllers/usercontroller.js');

//body parser middleware
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(bodyParser.json({type: 'application/vnd.api+json'}));

/*router.get( '/usercheck',function(req,res){
    if(userstatus){
        console.log("User is logged in ");
        console.log(userstatus);
        console.log(typeof(userstatus));
        res.status(200).json(userstatus);
    }
    else {
        console.log("NOT AUTHENTICATED");
        res.sendStatus(401);
    }
});*/

router.post('/logout', function(req, res){
    var id=req.body.userid;

    User.getUserById(id, function(err, user) {
        if(user)
        {
            console.log("Clearing token");
            user.token = null;
            res.sendStatus(200);
        }
        else
        {
            res.sendStatus(403);
        }
    });
});

router.post('/register',function(req,res){
    maincontroller.verification(req,res);
});

router.post('/login', function(req, res) {
    maincontroller.login(req,res);
});


    /*
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
    });*/


module.exports= router;
