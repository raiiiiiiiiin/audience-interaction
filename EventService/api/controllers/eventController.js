'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    Question = mongoose.model('Question');

exports.addEvent = function(req, res) {
    var new_event = new Event(req.body);

    new_event.save(function(err, event) {
        if (err) {
            res.send(err);
        }
        res.json(event);
    });
};

exports.getEvents = function(req, res) {
    Event.find({}, function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};

exports.getEventWithQuestions = function(req, res) {
    if (req.body.urlId) {
        Event.getEventWithQuestions(req.body.urlId, function(err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.addQuestion = function(req, res) {
    var question = new Question(req.body.question);

    if (req.body.urlId && question) {
        Event.addQuestion(req.body.urlId, question, function (err, event) {
            if (err)
                res.json(err);
            res.json(event);
        });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.deleteQuestion = function(req, res) {
    if (req.body.questionId && req.body.urlId) {
        Question.findById(req.body.questionId).remove()
            .exec(function(err, data) {
                if (err) {
                    res.json({error:'Question remove failed.'});
                }
                Event.removeQuestion(req.body.urlId, req.body.questionId,
                    function(err, data) {
                        if(err) {
                            return res.status(500).json({'error' : 'error in deleting address'});
                        }
                        res.send('Question remove success');
                });
            });
    }
};

exports.updateQuestion = function(req, res) {
    if (req.body._id) {
        var question = new Question(req.body);
        Question.findOneAndUpdate({_id: question._id}, {$set:{description:question.description}}, {new: true}, function (err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};