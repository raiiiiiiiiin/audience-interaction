'use strict';
module.exports = function(app) {
    var adminController = require("../controllers/adminController");

    app.route('/login')
        .post(adminController.login);

    app.route('/logout')
        .post(adminController.logout);

    app.route('/verify')
        .post(adminController.verify);
};