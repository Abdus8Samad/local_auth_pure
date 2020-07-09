const router = require('express').Router();

router.get('/login',(req,res) =>{
    res.send('login');
})

module.exports = router;