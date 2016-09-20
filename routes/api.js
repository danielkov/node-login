const express = require('express');
      api = express.Router(),
      bodyParser = require('body-parser'),
      jwt = require('jwt-simple'),
      User = require('../models/user'),
      secret = require('../options/config').secret,
      csrf = require('../middleware/csrf'),
      userAgent = require('express-useragent');

api.use(bodyParser.urlencoded({extended:true}));
api.use(bodyParser.json());
api.use(userAgent.express());

api.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the API!'
  })
})

// Send details to sign up a new user.
api.post('/user', (req, res) => {
  let errors = [];

  if (!req.body.username || req.body.username == 'undefined') {
    errors.push('Please provide a username.')
  }

  if (!req.body.password || req.body.password == 'undefined') {
    errors.push('Please provide a password.')
  }

  if (!req.body.email || req.body.password == 'undefined') {
    errors.push('Please provide a valid e-mail address.')
  }

  if (errors.length > 0) {
    res.json({
      success: false,
      message: errors,
      body: req.body
    })
    return;
  }

  let username = req.body.username,
      password = req.body.password,
      email = req.body.email;

  User.find({$or : [{username: username}, {email: email}]}, (err, docs) => {
    if (err) throw err;
    if (docs.length > 0) {
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].username === username) {
          errors.push('This username is already in use.')
        }
        if (docs[i].email === email) {
          errors.push('This e-mail address is already in use.')
        }
      }
      if (errors.length > 0) {
        res.json({
          success: false,
          message: errors
        })
        return;
      }
    }
    else {

      let user = new User({
        username: username,
        password: password,
        email: email
      })

      user.save((err, doc) => {
        if (err) throw err;
        if (doc) {
          res.json({
            success: true,
            message: `User ${doc.username} signed up successfully.`
          })
        }
        else {
          res.json({
            success: false,
            message: 'Something went wrong, while signing you up.'
          })
        }
      })
    }
  })
})

// Get information about a user, by sending a CSRF token.
api.get('/user', csrf, (req, res) => {
  let user = req.authedUser;
  let authedOS = req.decoded.os;

  res.json({
    success: true,
    message: 'Successfully retrieved user.',
    username: user.username,
    email: user.email,
    os: authedOS
  })
})

// Post user information and get back a valid CSRF token as a response.
api.post('/auth', (req, res) => {

  let errors = [];

  if (!req.body.username) {
    errors.push('Please provide a username.')
  }

  if (!req.body.password) {
    errors.push('Please provide a password.')
  }

  if (errors.length > 0) {
    res.json({
      success: false,
      message: errors
    })
    return;
  }

  let username = req.body.username,
      password = req.body.password

  User.findOne({username: username}, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'No user found with that username.'
      })
    }else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) throw err;

        if (!isMatch) {
          res.json({
            success: false,
            message: 'Username and password do not match.'
          })
        }
        else {
          let token = jwt.encode({
            username: user.username,
            device: req.useragent.os,
            time: Date.now()
          }, secret);
          user.tokens.push(token);
          user.markModified('tokens');
          user.save((err, doc) => {
            if (err) throw err;
            res.json({
              success: true,
              message: 'Successfully logged in.',
              username: user.username,
              email: user.email,
              token: token
            })
          })
        }
      })
    }
  })
})

// Put new user information to update it.
api.put('/user', csrf, (req, res) => {
  let user = req.authedUser;

  if (req.body.password) {
    user.password = req.body.password;
    user.markModified('password');
  }

  if (req.body.email) {
    user.email = req.body.email;
    user.markModified('email');
  }

  user.save((err, doc) => {
    if (err) throw err;
    res.json({
      success: true,
      message: 'Successfully saved changes.'
    })
  })
})

// Delete the user, using the CSRF token to validate request.
api.delete('/user', csrf, (req, res) => {
  let user = req.authedUser;

  User.findOneAndRemove({username: user.username}, {}, (err, doc) => {
    if (err) throw err;

    res.json({
      success: true,
      message: `Successfully removed user: ${doc.username}`
    })
  })
})

module.exports = api;
