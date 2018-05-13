'use strict';
var mongoose = require('mongoose');
var Question = require('./question');

var EventSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
    },
    urlId: {
        type: String,
        unique: true,
        trim: true
    },
    startPeriod: {
        type: Date,
        required: true,
    },
    endPeriod: {
        type: Date,
        required: true,
    },
    createdDate: {
        type: Date,
    },
    questions:  [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    }],
    goodQuestions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }
});

EventSchema.statics.addQuestion = function addQuestion(urlId, question, callback) {
    question.save(function(err, question) {
        Event.findOne({urlId: urlId}, function (err, event) {
            if (err)
                return callback(err);
            if (event) {
                event.questions.push(question);
                Event.findOneAndUpdate({_id: event._id}, event, {new: true}, function (err, event) {
                    if (err)
                        callback(err);
                    else
                        callback(null, event);
                });
            } else {
                callback({error:"Cannot find event."});
            }
        });
    });
};

EventSchema.statics.getEventWithQuestions = function getQuestions(urlId, callback) {
    Event.findOne({urlId: urlId}, function(err, event) {
        if (!event)
            callback(null,[]);
    })
        .populate('questions')
        .exec(function(err, event) {
            callback(err, event);
        });
};

EventSchema.statics.removeQuestion = function removeQuestion(urlId, questionId, callback) {
    Event.findOneAndUpdate(
        {urlId: urlId},
        {$pull: {questions:questionId}},
        { new: true }).exec(function(err, data) {
            Event.findOneAndUpdate(
                {urlId: urlId},
                {$pull: {goodQuestions:questionId}},
                { new: true }).exec(function(err, data) {
                callback(err, data);
            });
        });
};

EventSchema.pre('save', function(next) {
    var event = this;
    event.createdDate = new Date();

    event.urlId = getUrlId().toLowerCase();
    event.questions = [{}];

    next();
});

var getUrlId = function() {
    var randomstring = require("randomstring");

    var urlId = randomstring.generate({
        length: 7
    });

    Event.findOne({urlId: urlId})
        .exec(function (err, event) {

            if (event) {
                urlId = getUrlId();
            }

        });
    return urlId;
};


var Event = mongoose.model('Event', EventSchema);
module.exports = Event;