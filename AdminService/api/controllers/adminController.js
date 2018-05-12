'use strict';

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin');

exports.login = function(req, res, next) {
    if (req.body.logEmail && req.body.logPassword) {
        Admin.authenticate(req.body.logEmail, req.body.logPassword, function(error, admin) {
            if (error || !admin) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                res.status(400).json({isValid: 'false', error:"Wrong email or password."});
                return next(err);
            } else {
                res.json({isValid: 'true', message:"login success."});
            }
        });
    } else {
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.status(400).json({error:"passwords don't match"});
            return next(err);
        }

        var new_user = new Admin(req.body);
        new_user.save(function(err, task) {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

};
