const router = require('express').Router(),
bcrypt = require('bcrypt'),
User = require('../models/user');

function login(user,password){
    let promise = new Promise((resolve,reject) =>{
        let { username } = user;
        User.findOne({username})
        .then(user =>{
            if(user){
                bcrypt.hash(password,user.salt,(err,hash) =>{
                    if(hash === user.hash && !err){
                        resolve(user);
                    } else {
                        (err)?(
                            reject(err)
                        ):(
                            reject('Incorrect Username or Password')
                        )
                    }
                })
            } else {
                reject('Incorrect Username or Password')
            }
        })    
    })
    return promise;
}

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
            login(user,req.body.password)
            .then(user =>{
                res.cookie('user',user,{
                    httpOnly:true,
                    sameSite:'strict'
                })
                req.flash('success',`Welcome back ${user.username}`);
                res.redirect('/');
            })
            .catch(err =>{
                req.flash('error',err);
                res.redirect('/');
            })
        } else {
            req.flash('error',`Incorrect Username or Password`);
            res.redirect('/');
        }
    })
    .catch(err =>{
        req.flash('error',err.message);
        res.redirect('/');
        console.log(err);
    })
})

router.post('/register',(req,res) =>{
    User.findOne(req.body.user)
    .then(user =>{
        if(user){
            req.flash('error','User already Created');
            res.redirect('/');
        } else {
            register(req.body.user,req.body.password)
            .then(user =>{
                console.log(user);
                res.cookie('user',user,{
                    httpOnly:true,
                    sameSite:'strict'
                })
                req.flash('success',`Welcome ${user.username}`);
                res.redirect('/');
            })
            .catch(err =>{
                req.flash('error',err);
                res.redirect('/');
            })
        }
    })
    .catch(err =>{
        req.flash('error',err.message);
        res.redirect('/');
    })
})


router.get('/logout',(req,res) =>{
    res.clearCookie('user');
    req.flash('success','You\'ve been logged out successfully');
    res.redirect('/');
})
module.exports = router;