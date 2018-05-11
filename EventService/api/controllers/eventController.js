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
                            return res.status(500).json({'error' : 'error in deleting question'});
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
                                return res.status(500).json({'error' : 'error in adding good question'});
                            }
                            res.send('Good question add success');
                        });
                } else {
                    return res.status(500).json({'error' : 'You can only have 3 good questions'});
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
                        return res.status(500).json({'error' : 'error in removing good question'});
                    }
                    res.send('Good question remove success');
                });
    }
};

exports.join = function(req, res) {
    if (req.body.code) {
        Event.findOne({code:req.body.code})
            .exec(function(err, data) {
                console.log(err, data);
                if (err || !data)
                    return res.status(500).json({'error' : 'Invalid code.'});

                var currentDate = new Date();
                if (data.startPeriod < currentDate && currentDate < data.endPeriod) {
                    req.session.urlId = data.urlId;
                    res.send('log in success');
                } else {
                    return res.status(500).json({'error' : 'Event time do not match.'});
                }

            });
    } else {
        res.json({error:'Invalid parameters.'});
    }
};

exports.verify = function(req, res, next) {
    if (req.body.urlId) {
        Event.findOne({urlId:req.session.urlId})
            .exec(function (error, data) {
                if (error) {
                    return next(error);
                } else {
                    if (data === null || req.session.urlId !== req.body.urlId) {
                        var err = new Error('Not authorized! Go back!');
                        err.status = 400;
                        res.json({isValid:false});
                    } else {
                        res.json({isValid:true});
                    }
                }
            });
    } else {
        res.json({error:'Invalid parameters.'});
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