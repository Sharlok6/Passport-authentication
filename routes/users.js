const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');//This double dot is used to go back to standard directory

//Login Page
router.get('/login',(req,res) => res.render("login"));

//Register Page
router.get('/register',(req,res) => res.render("register"));

// Register handle
router.post('/register',(req,res)=>{
    const { name,email,password,password2 }=req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password ||!password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    //check password length
    if(password.length <6){
        errors.push({msg : 'Password should be atleast 6 characters!'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        // Validation pass
        User.findOne({ email: email})
        .then(user => {
            if(user){
                //User exists
                errors.push({ msg: 'Email is already registerd'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                // Hash Password
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;

                        //Set password to hashed
                        newUser.password = hash;

                        //Save user
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg','You are now registered and can login');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });
    }
});

// Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect :'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

// Logout
router.get('/logout', (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});

module.exports = router;