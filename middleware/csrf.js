const jwt = require('jwt-simple'),
      secret = require('../options/config').secret,
      User = require('../models/user');

module.exports = function (req, res, next) {

  if (req.headers['authorization'] || req.headers['csrf-token'] || req.headers['xsrf-token'] || req.headers['x-csrf-token'] || req.headers['x-xsrf-token']) {
    let token = req.headers['authorization'] || req.headers['csrf-token'] || req.headers['xsrf-token'] || req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
    let decoded = jwt.decode(token, secret);

    let username = decoded.username;

    User.findOne({username: username}, (err, user) => {
      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'Unauthorized.'
        })
      }else {
        let tokens = user.tokens;

        if (tokens.length > 0) {
          if (tokens.indexOf(token) === -1) {
            res.json({
              success: false,
              message: 'Access token invalid or was revoked.'
            })
          }
          else {
            user.last_login = Date.now();
            user.markModified('last_login');
            user.save((err, doc) => {
              if (err) throw err;
            })
            req.authedUser = user;
            req.decoded = decoded;
            next();
          }
        }
        else {
          res.json({
            success: false,
            message: 'No valid access tokens for this user.'
          })
        }
      }
    })
  }
  else {
    res.send({
      success: false,
      message: 'Unauthenticated.'
    })
  }

}
