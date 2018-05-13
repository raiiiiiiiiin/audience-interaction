'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    Question = mongoose.model('Question');

exports.addEvent = function(req, res) {
    var new_event = new Event(req.body);

    new_event.save(function(err, event) {
        if (err) {
            res.status(400).send(err);
        }
        res.json(event);
    });
};

exports.getEvents = function(req, res) {
    Event.find({}, function(err, event) {
        if (err)
            res.json(err);
        else {
            res.json(event);
        }
    });
};

exports.getEventWithQuestions = function(req, res) {
    if (req.body.urlId) {
        Event.getEventWithQuestions(req.body.urlId, function(err, event) {
            if (err)
                res.json(err);
            else {
                res.json(event);
            }
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
            else {
                res.json(event);
            }
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
                            res.json({isValid: false, error : 'error in deleting question'});
                        } else {
                            res.json({isValid: true, message: 'Question remove success'});
                        }
                });
            });
    }
};

exports.updateQuestion = function(req, res) {
    if (req.body._id) {
        var question = new Question(req.body);
        Question.findOneAndUpdate({_id: question._id}, {$set:{description:question.description}}, {new: true}, function (err, event) {
            if (err)
                res.json({isValid: false, error : 'error in updating question'});
            else {
                res.json({isValid: true, message: 'Question updated'});
            }
        });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.addGoodQuestion = function(req, res) {
    if (req.body.questionId && req.body.urlId) {
        Event.aggregate([{$match: {urlId: req.body.urlId}}, {$project: {goodQuestions: {$size: '$goodQuestions'}}}],
            function (err, data) {
                if (data && data[0].goodQuestions < 3) {
                    Event.findOneAndUpdate(
                        {urlId: req.body.urlId},
                        {$addToSet:{goodQuestions:req.body.questionId}},
                        {new: true},
                        function (err, data) {
                            if(err) {
                                return res.json({isValid: false, error : 'error in adding good question'});
                            } else {
                                res.json({isValid: true, message:'Good question add success'});
                            }
                        });
                } else {
                    return res.json({isValid: false, error : 'You can only have 3 good questions'});
                }

        });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.removeGoodQuestion = function(req, res) {
    if (req.body.questionId && req.body.urlId) {
        Event.findOneAndUpdate(
            {urlId: req.body.urlId},
            {$pull: {goodQuestions:req.body.questionId}},
            { new: true }).exec(
                function(err, data) {
                    if(err) {
                        return res.json({isValid: false, error : 'error in removing good question'});
                    } else {
                        res.json({isValid: true, message:'Good question remove success'});
                    }
                });
    }
};

exports.join = function(req, res) {
    if (req.body.code) {
        Event.findOne({code:req.body.code})
            .exec(function(err, data) {
                if (err || !data)
                    res.json({isValid: false, 'error' : 'Invalid code.'});
                else {
                    var currentDate = new Date();
                    if (data.startPeriod < currentDate && currentDate < data.endPeriod) {
                        res.json({isValid: true, urlId: data.urlId});
                    } else {
                        res.json({isValid: false, 'error' : 'Event time do not match.'});
                    }
                }
            });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.likeQuestion = function(req, res) {
    if (req.body._id) {
        Question.like(req.body._id, req.body.sessionId,
            function(err, data) {
                if (err) {
                    return next(err);
                } else {
                    return res.json({message:'like success'});
                }
            });
    }
};

exports.unlikeQuestion = function(req, res) {
    if (req.body._id) {
        Question.unlike(req.body._id, req.body.sessionId,
            function(err, data) {
                if (err) {
                    return next(err);
                } else {
                    return res.send({message:'unlike success'});
                }
            });
    }
};