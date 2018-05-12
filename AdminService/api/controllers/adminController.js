'use strict';

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin');

exports.login = function(req, res) {
    if (req.body.logEmail && req.body.logPassword) {
        Admin.authenticate(req.body.logEmail, req.body.logPassword, function(error, admin) {
            if (error || !admin) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                res.json({isValid: false, error:"Wrong email or password."});
            } else {
                res.json({isValid: true, message:"login success."});
            }
        });
    } else {
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.json({isValid: false, error:"passwords don't match"});
        } else {
            var new_user = new Admin(req.body);
            new_user.save(function(err, task) {
                if (err) {
                    res.json({isValid: false, error:"You already got an account."});
                } else {
                    res.json({isValid: true, message:"Success"})
                }
            });
        }

    }

};
