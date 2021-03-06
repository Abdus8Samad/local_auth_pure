const express = require('express'),
app = express(),
morgan = require('morgan'),
path = require('path'),
PORT = process.env.PORT || 8080,
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
expressSession = require('express-session'),
flash = require('connect-flash'),
mongoose = require('mongoose');
require('dotenv/config');

//Connect to the DB
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => console.log('Connected to the DB'))
.catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressSession({
    secret:'My secret !!',
    resave:true,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        sameSite:'strict'
    }
}))
app.use(flash());
app.use((req,res,next) =>{
    req.user = req.cookies['user']
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
})

const indexRoutes = require('./routes/index'),
authRoutes = require('./routes/auth');
app.use('/',indexRoutes);
app.use('/auth',authRoutes);

app.listen(PORT,() => console.log(`Server Listening at port ${PORT}`));