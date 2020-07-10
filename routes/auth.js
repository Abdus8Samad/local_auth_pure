const router = require('express').Router(),
User = require('../models/user'),
pure = require('../pure/pure');

router.post('/login',(req,res) =>{
    //Find the user in the DB
    let { username } = req.body.user;
    //Password entered by the user
    let password = req.body.password;
    User.findOne({username})
    .then(user =>{
        pure.login(user,password)
        .then(user =>{
            //Create the cookie named user as you want for logging in [i'm creating a session cookie]
            //The cookie will be stuffed in the req obj as req.user in the next request automatically
            res.cookie('user',user,{
                httpOnly:true,
                sameSite:'lax'
            })
            //Successful redirect
            res.redirect('/')
        })
        .catch(err =>{
            //Handle the err as you want can be that user is not registered or password is incorrect
            console.log(err);
            //Failure Redirect
            res.redirect('/');
        })
    })
})

router.post('/register',(req,res) =>{
    //Check if user already registered
    let { username } = req.body.user;
    User.findOne({username})
    .then(user =>{
        if(user){
            //User already registered
            res.redirect('/');
        } else {
            //Register with the given user and password
            pure.register(req.body.user,req.body.password)
            .then(user =>{
                console.log(user);
                //Create the cookie named user as you want for logging in [i'm creating a session cookie]
                //The cookie will be stuffed in the req obj as req.user in the next request automatically
                res.cookie('user',user,{
                    httpOnly:true,
                    sameSite:'strict'
                })
                //Successful Redirect
                res.redirect('/');
            })
            .catch(err =>{
                console.log(err);
                //Failure Redirect
                res.redirect('/');
            })
        }
    })
    .catch(err =>{
        //Error by the DB
        console.log(err);
        //Failure Redirect
        res.redirect('/');
    })
})


router.get('/logout',(req,res) =>{
    //For logging out just clear the cookie named user
    res.clearCookie('user');
    //Redirect after logging out
    res.redirect('/');
})
module.exports = router;