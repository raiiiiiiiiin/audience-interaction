'use strict';
module.exports = function(app) {
    var adminController = require("../controllers/adminController");

    app.route('/login')
        .post(adminController.login);

};