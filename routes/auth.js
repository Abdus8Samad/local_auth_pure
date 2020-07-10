const router = require('express').Router(),
bcrypt = require('bcrypt'),
User = require('../models/user');

function register(user, password){
    let promise = new Promise((resolve,reject) =>{
        bcrypt.genSalt(10,(err,salt) =>{
            bcrypt.hash(password,salt,(err,hash) =>{
                User.create({
                    ...user,
                    hash,
                    salt
                })
                .then(user =>{
                    resolve(user);
                })
                .catch(err =>{
                    reject(err);
                })
            })
        })    
    })
    return promise;
}

router.post('/login',(req,res) =>{
    User.findOne(req.body.user)
    .then(user =>{
        if(user){
            
        } else {
            console.log('Incorrect Username or Password');
            res.redirect('/');
        }
    })
    .catch(err =>{
        res.redirect('/');
        console.log(err);
    })
})

router.post('/register',(req,res) =>{
    User.findOne(req.body.user)
    .then(user =>{
        if(user){
            console.log('User already Created');
            res.redirect('/');
        } else {
            register(req.body.user,req.body.password)
            .then(user =>{
                console.log(user);
                res.cookie('user',user,{
                    httpOnly:true,
                    sameSite:'lax'
                })
                res.redirect('/');
            })
            .catch(err =>{
                console.log(err);
                res.redirect('/');
            })
        }
    })
    .catch(err =>{
        console.log(err);
        res.redirect('/');
    })
})

module.exports = router;