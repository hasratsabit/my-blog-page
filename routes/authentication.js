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
			res.json({ success: false, message: 'You must provide a name. '});
			// Check if the email field is empty.
		}else if (!req.body.email) {
			res.json({ success: false, message: 'You must provide an E-mail'});
			// Check if the username field is empty.
		}else if (!req.body.username) {
			res.json({ success: false, message: 'You must provide a username.'});
			// Check if the password field is empty.
		}else if (!req.body.password) {
			res.json({ success: false, message: 'You must provide a password.'});
		}else {
			let user = new User({
				name: req.body.name,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password
			})
			// Save the user object.
			user.save((err) => {
				// Check if there is error.
				if(err){
					// Check if there is duplicate error for (username and password.)
					if(err.code === 11000) {
						res.json({ success: false, message: 'Username or e-mail already exists' });
						// Check if it is name validation error.
					}else if(err.errors.name){
						res.json({ success: false, message: err.errors.name.message });
						// Check if it is Email validation error.
					}else if (err.errors.email) {
						res.json({ success: false, message: err.errors.email.message });
						// Check if it is Username validation error.
					}else if (err.errors.username) {
						res.json({ success: false, message: err.errors.username.message });
						// Check if it is Password validation error.
					}else if (err.errors.password) {
						res.json({ success: false, message: err.errors.password.message });
						// Check if it is a validation error thats not covered.
					}else if (err.errors) {
						res.json({ success: false, message: 'Could not save user. Error: ', err });
					}else {
						// Respond if there error is other than validation.
						res.json({ success: false, message:  err });
					}
				}else {
					// Save user after validaton completed.
					res.json({ success: true, message: 'User successfully registered.' });
				}
			})
		}
	})





return router;
}
