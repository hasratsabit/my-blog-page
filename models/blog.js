const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Schema = mongoose.Schema;



// ==========================================================
//							TITLE VALIDATION
// ==========================================================

 // Title Length Checker
const titleLengthChecker = (title) => {
	// Check if there is a title.
	if(!title){
		// If there is no title, return error.
		return false;
		// Check the title length
	}else if(title.length < 5 || title.length > 50) {
		// If the title length is smaller than 5 and greater than 50 return error.
		return false;
	}else {
		return true;
	}
}


// Valid Title Checker
const validTitleChecker = (title) => {
	// Check if there is title.
	if(!title){
		// If there is no title, return error.
		return false;
	}else {
		// Regular title expression
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		// Return a valid title if passes the test.
		return regExp.test(title)
	}
}

// The Title Validators Array
const titleValidators = [
	{
		validator: titleLengthChecker, // Title length checker.
		message: 'The title must be at least 5 characters but no more than 50'
	},
	{
		validator: validTitleChecker, // Valid title checker.
		message: 'The title must not contain special characters.'
	}
];



// ==========================================================
//							BODY VALIDATION
// ==========================================================

	// Body Length Checker
	const bodyLengthChecker = (body) => {
		// Check if there is body.
		if(!body){
			// If there is no body, return error.
			return false;
			// Check the length of the body
		}else if (body.length < 5 || body.length > 800) {
			// If the length of the body is smaller than 5 and greater than 800 letters, return error.
			return false
		}else {
			// If passed the length test, return true and success.
			return true;
		}
	}


	const bodyValidators = [
		{
			validator: bodyLengthChecker, // Body Length Checker
			message: 'The body should be at least 5 letters but no longer than 800'
		}
	]


// ==========================================================
//							COMMENT VALIDATION
// ==========================================================

	// Comment Length Checker.
	const commentLengthChecker = (comment) => {
		// Check if there is comment.
		if(!comment){
			// Return error if there is no comment.
			return false;
			// Check the comment length.
		}else if(comment.length < 1 || comment.lenth > 200){
			// Return false if the comment is smaller than 1 and longer than 200.
			return false;
		}else {
			// Return true and success if the length test is passed.
			return true;
		}
	}


	// Comment Validator
	const commentValidator = [
		{
			validator: commentLengthChecker,
			message: 'Comment should be at least 1 character but no more than 200'
		}
	]



// ==========================================================
//							BLOG SCHEMA
// ==========================================================
const BlogSchema = new Schema({
	title: { type: String, required: true, validate: titleValidators },
	body: { type: String, required: true, validate: bodyValidators},
	createdBy: { type: String, required: true },
	username: { type: String, required: true },
	date: { type: Date, default: Date.now()},
	likes: { type: Number, default: 0 },
	likedBy: { type: Array },
	commentNum: { type: Number, default: 0 },
	comments: [{
		comment: { type: String, validate: commentValidator },
		commentator: { type: String }
	}]
});


module.exports = mongoose.model('Blog', BlogSchema);
