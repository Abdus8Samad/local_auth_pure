# Pure local Auth v2

### Add this in your server file `server.js`
```js
app.use(require('./pure/pure').initialise)
```
### Auth Routes
```js
const router = require('express').Router(),
User = require('../models/user'),
pure = require('../pure/pure');

router.post('/login',(req,res) =>{
    //Password entered by the user
    let password = req.body.password;
    //User obj given by the user
    let user = req.body.user;
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

router.post('/register',(req,res) =>{
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
        })

router.get('/logout',(req,res) =>{
    //For logging out just clear the cookie named user
    res.clearCookie('user');
    //Redirect after logging out
    res.redirect('/');
})
module.exports = router;
```