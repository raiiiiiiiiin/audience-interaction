'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var AdminSchema = new mongoose.Schema({
    email: {
       type: String,
       unique: true,
       required: true,
       trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
});

AdminSchema.statics.authenticate = function(email, password, callback) {
    Admin.findOne({email:email})
        .exec(function (err, admin) {
            if (err) {
                return callback(err);
            } else if (!admin){
                var err = new Error('Admin account not found.');
                err.status = 401;
                return callback(err);
            }

            bcrypt.compare(password, admin.password, function (err, result) {
                if (result === true) {
                    return callback(null, admin);
                } else {
                    var err = new Error('Invalid password.');
                    err.status = 401;
                    return callback(err);
                }
            });

        });
};

AdminSchema.pre('save', function(next) {
   var admin = this;
   bcrypt.hash(admin.password, 10, function (err, hash) {
       if (err) {
           return next(err);
       }
       admin.password = hash;
       admin.passwordConf = '';
       next();
   })
});

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;