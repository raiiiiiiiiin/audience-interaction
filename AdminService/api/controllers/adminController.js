'use strict';

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin');

exports.login = function(req, res, next) {
    if (req.body.logEmail && req.body.logPassword) {
        Admin.authenticate(req.body.logEmail, req.body.logPassword, function(error, admin) {
            if (error || !admin) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                res.json({error:"Wrong email or password."});
                return next(err);
            } else {
                req.session.adminId = admin._id;
                return res.send('log in success');
            }
        });
    } else {
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.json({error:"passwords don't match"});
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

exports.logout = function(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.send('log out success');
            }
        });
    }
};

exports.verify = function(req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    res.json({isValid:false});
                } else {
                    res.json({isValid:true});
                }
            }
        });
};