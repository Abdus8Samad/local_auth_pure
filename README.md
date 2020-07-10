# pure Local auth without any auth library

## clone the repo open bash and type
```bash
$ npm i
```

## Usage `auth.js`

```js
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
```
