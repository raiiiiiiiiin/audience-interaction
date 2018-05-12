'use strict';
var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: 'Anonymous'
    },
    createdDate: {
        type: Date,
    },
    likes: [{
        type: String
    }],
    unlikes: [{
        type: String
    }]
});

QuestionSchema.statics.like = function(questionId, sessionId, callback) {
    // remove unlike first
    Question.findOneAndUpdate(
        {_id: questionId},
        {$pull: {unlikes:sessionId}},
        { new: true }).exec(
        function(err, data) {
            // then like
            Question.findOneAndUpdate(
                {_id: questionId},
                {$addToSet:{likes:sessionId}},
                {new: true},
                function (err, data) {
                    callback(err, data);
                });
        });
};

QuestionSchema.statics.unlike = function(questionId, sessionId, callback) {
    // remove like first
    Question.findOneAndUpdate(
        {_id: questionId},
        {$pull: {likes:sessionId}},
        { new: true }).exec(
        function(err, data) {
            // then unlike
            Question.findOneAndUpdate(
                {_id: questionId},
                {$addToSet:{unlikes:sessionId}},
                {new: true},
                function (err, data) {
                    callback(err, data);
                });
        });
};

QuestionSchema.pre('save', function(next) {
    var question = this;

    question.createdDate = new Date();

    next();
});


var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;