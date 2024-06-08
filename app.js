const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const path = require('path');

const app = express();

//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("Mongodb connected..."))
    .catch(err =>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
// app.set('views', path.join(__dirname, 'views'));

//Bodyparser
app.use(express.urlencoded({extended:false}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash (middlewares)
app.use(flash());

// global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

const PORT = process.env.PORT || 3000;

//Using this cache control middleware,
//Any route that needs to be protected from login in again after log out by method of
// going back by clicking laptop's back button, so it will prevent it
// and we can add this middleware to any route

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/', require('./routes/dashboard')); // Include the dashboard route

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});