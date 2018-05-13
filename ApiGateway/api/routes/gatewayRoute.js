'use strict';
module.exports = function(app) {
    var gatewayController = require("../controllers/gatewayController");

    var verifyAdminLogged = function(req, res, next) {
        console.log(req.session.id);
        if (req.session.adminLoggedIn) {
            next();
        } else {
            res.status(401).json({message:'invalid request'});
        }
    };

    var verifyEventJoined = function(req, res, next) {
        console.log(req.session.id);
        if (req.session.urlId) {
            req.body.urlId = req.session.urlId; // add urlId
            next();
        } else {
            res.status(401).json({message:'invalid request'});
        }
    };

    app.route('/login')
        .post(gatewayController.login);
    app.route('/logout')
        .post(gatewayController.logout);
    app.route('/get-events')
        .post(verifyAdminLogged, gatewayController.getEvents);
    app.route('/create-event')
        .post(verifyAdminLogged, gatewayController.createEvent);
    app.route('/edit-question')
        .post(verifyAdminLogged, gatewayController.editQuestion);
    app.route('/delete-question')
        .post(verifyAdminLogged, gatewayController.deleteQuestion);
    app.route('/toggle-good-question')
        .put(verifyAdminLogged, gatewayController.toggleGoodQuestion)
        .delete(verifyAdminLogged, gatewayController.toggleGoodQuestion);
    app.route('/join')
        .post(gatewayController.join);
    app.route('/event')
        .post(verifyEventJoined, gatewayController.eventWithQuestions);
    app.route('/add-question')
        .post(verifyEventJoined, gatewayController.addQuestion);
    app.route('/like')
        .put(verifyEventJoined, gatewayController.like)
        .delete(verifyEventJoined, gatewayController.like);

};