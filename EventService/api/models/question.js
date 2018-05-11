'use strict';
var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    createdDate: {
        type: Date,
    }
});

QuestionSchema.pre('save', function(next) {
    var question = this;

    question.createdDate = new Date();

    next();
});


var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;