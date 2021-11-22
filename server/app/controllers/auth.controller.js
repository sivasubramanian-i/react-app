var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/auth.model');
const config = require('../../config/db.config')

// Create and Save a new User
exports.login = (req, res) => {
    try {
        if (req.body && req.body.username && req.body.password) {
            User.find({ name: req.body.username }, (err, data) => {
            if (data.length > 0) {
              if (bcrypt.compareSync(data[0].password, req.body.password)) {
                checkUserAndGenerateToken(data[0], req, res);
              } else {
                res.status(400).json({
                  errorMessage: 'Username or password is incorrect!',
                  status: false
                });
              }
    
            } else {
              res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
              });
            }
          })
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }    
};
// Retrieve and return all Users from the database.
exports.register = (req, res) => {
    try {
        if (req.body && req.body.username && req.body.password) {
            User.find({ name: req.body.username }, (err, data) => {
            if (data.length == 0) {
              let user = new User({
                name: req.body.username,
                password: req.body.password
              });
              user.save((err, data) => {
                if (err) {
                  res.status(400).json({
                    errorMessage: err,
                    status: false
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    title: 'Registered Successfully.'
                  });
                }
              });
    
            } else {
              res.status(400).json({
                errorMessage: `UserName ${req.body.username} Already Exist!`,
                status: false
              });
            }
    
          });
    
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
};

function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.name, id: data._id }, config.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true
        });
      }
    });
}
