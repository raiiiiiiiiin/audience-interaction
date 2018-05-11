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

};