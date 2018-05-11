'use strict';
module.exports = function(app) {
    var eventController = require("../controllers/eventController");

    app.route('/add-event')
        .post(eventController.addEvent);

    app.route('/get-events')
        .post(eventController.getEvents);

    app.route('/get-event-with-questions')
        .post(eventController.getEventWithQuestions);

    app.route('/add-question')
        .post(eventController.addQuestion);

    app.route('/delete-question')
        .post(eventController.deleteQuestion);

    app.route('/update-question')
        .post(eventController.updateQuestion);

    app.route('/toggle-good-question')
        .put(eventController.addGoodQuestion)
        .delete(eventController.removeGoodQuestion);

    app.route('/join')
        .post(eventController.join);

    app.route('/verify')
        .post(eventController.verify);

    app.route('/logout')
        .post(eventController.logout);

    app.route('/like')
        .put(eventController.likeQuestion)
        .delete(eventController.unlikeQuestion);

};