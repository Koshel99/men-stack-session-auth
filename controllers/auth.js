const express = require("express");
const User = require('../models/user.js');
const router = express.Router();
const bcrypt = require("bcrypt");

router.get('/sign-up', (req, res)=> {
    res.render('auth/sign-up.ejs')
})

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const password = req.body.password;
    const confirmedPassword = req.body.confirmPassword;
    const username = req.body.username;

// check the passwords for validity
    if(password != confirmedPassword){
        return res.send('Passwords do not match');
    }

// see if the user exists in the DP

const userInDatabase = await User.findOne({username});

if (userInDatabase){
    return res.send('Username or Password is invalid')
}

// create the new registration

// encrypt password

const hashedPassword = bcrypt.hashSync(req.body.password, 10);
req.body.password = hashedPassword;


// replace the raw pw with ecrypted pw

req.body.password = hashedPassword;

// save user to dp

const newUser = await User.create(req.body)
res.send(`Thanks for signing up ${newUser.username}`);
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    // res.send("Request to sign in received!");

    const password = req.body.password;
    const username = req.body.username;

    const userInDatabase = await User.findOne({username});

    // check if user exists
    if (!userInDatabase) {
        return res.send('User or Password invalid');
    }

    const validPassword = bcrypt.compareSync(password, userInDatabase.password);

    if (!validPassword){
        return res.send('Login failed. Please try again!')
    };

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
    };

    res.redirect("/");

});

// sign out

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = router;
