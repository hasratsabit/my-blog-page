const User = require('../models/user');
const jwt = require('jsonwebtoken');

const config = require('../config/database');


module.exports = (router) => {

// ==========================================================
// 		 									REGISTER USER
// ==========================================================

	router.post('/registerUser', (req, res) => {
		// Check if the name field is empty.
		if(!req.body.name){
			res.json({ success: false, message: 'You must provide your name.'});
		// Check if the username field is empty.
		}else if(!req.body.username){
			res.json({ success: false, message: 'You must provide a username.'});
		// Check if the email field is empty.
		}else if(!req.body.email){
			res.json({ success: false, message: 'You must provide an E-mail address.'});
		// Check if the password field is empty.
		}else if (!req.body.password) {
			res.json({ success: false, message: 'You must provide a password.'});
		}else {

			// Store the input values given by user in the user object.
			let user = new User({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});

			// Save object.
			user.save((err) => {
				// Check for error.
				if(err){
					// Check if it is a username or email duplicate error.
					if(err.code === 11000){
						res.json({ success: false, message: 'E-mail or Username already exist.'});
					}else {
						// Check if it is a validation error.
						if(err.errors){
							// Check if it is name validation error.
							if(err.errors.name){
								res.json({ success: false, message: err.errors.name.message });
							// Check if it is username validation error.
							}else if (err.errors.username) {
								res.json({ success: false, message: err.errors.username.message });
							// Check if it is email validation error.
							}else if (err.errors.email) {
								res.json({ success: false, message: err.errors.email.message });
							// Check if it is password validation error.
							}else if (err.errors.password) {
								res.json({ success: false, message: err.errors.password.message });
							}else {
								// Respond if it is any othe validation error.
								res.json({ success: false, message:  err });
							}
						}else {
							// Respond if it is any error other than validation.
							res.json({ success: false, message: 'Could not save user. Error: ', err });
						}
					}
				}else {
					// Respond with success message once the validaiton test is passed.
					res.json({ success: true, message: 'User successfully registered.'})
				}
			})
		}
	})



// ==========================================================
// 		 					CHECK IF THE EMAIL IS AVAILABLE
// ==========================================================

	router.get('/checkEmail/:email', (req, res) => {
		// Check if email is provided.
		if(!req.params.email){
			res.json({ success: false, message: 'E-mail was not provided. '});
		}else {
			// Find the email in the database
			User.findOne({ email: req.params.email }, (err, user) => {
				// Check if there is a connection error.
				if(err){
					res.json({ success: false, message: 'Connection error occured.'});
				// Respond if the email already exist in the database.
			}else if (user) {
					res.json({ success: false, message: 'E-mail is already taken '})
					// Respond if the email is available and it is not already taken.
				}else {
					res.json({ success: true, message: 'E-mail is available.'});
				}
			})
		}
	})


// ==========================================================
// 		 					CHECK IF THE USERNAME IS AVAILABLE
// ==========================================================
	router.get('/checkUsername/:username', (req, res) => {
		// Check if username is provided.
		if(!req.params.username){
			res.json({ success: false, message: 'Username was not provided. '});
		}else {
			// Find the username in the database
			User.findOne({ username: req.params.username }, (err, user) => {
				// Check if there is a connection error.
				if(err){
					res.json({ success: false, message: 'Connection error occured.'});
				// Respond if the username already exist in the database.
			}else if (user) {
					res.json({ success: false, message: 'Username is already taken '})
					// Respond if the username is available and it is not already taken.
				}else {
					res.json({ success: true, message: 'Username is available.'});
				}
			})
		}
	})


return router;
}
