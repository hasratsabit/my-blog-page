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



// ==========================================================
// 		 								LOGIN ROUTE
// ==========================================================

	router.post('/login', (req, res) => {
		// Check if the username is provided.
		if(!req.body.username){
			// Respond if no username is provided.
			res.json({ success: false, message: 'Please provide a username.'});
		// Check if the password is proided.
		}else if (!req.body.password) {
			// Respond if the password is not provided.
			res.json({ success: false, message: 'Please provide a password.'});
		}else {
			// Find the username in the database that's given by user.
			User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
				// Check for error.
				if(err){
					// Respond with error if there is one.
					res.json({ success: false, message: err });
					// Check if there is a user with given username.
				}else if (!user) {
					// Respond if the username is not found.
					res.json({ success: false, message: 'Username was not found. '});
				}else {
					// Compare the password via method in the schema.
					const validPassword = user.comparePassword(req.body.password);
					// Check if the password matches the one in database.
					if(!validPassword){
						// Respond if the password is not matched with one in database.
						res.json({ success: false, message: 'Password does not match.'});
					}else {
						// Create token to remember the logged in user.
						const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
						// Respond with success message afte user is validated to login.
						res.json({
							success: true,
							message: 'You are successfully logged in.',
							token: token,
							user: {
								username: user.username
							}
						});
					}
				}
			});
		}
	});



// ==========================================================
// 		 						TOKEN INTERCEPT MIDDLEWARES
// ==========================================================
	//
	// Note: This middleware intercepts the token that comes from the client side stored in the browser. Every route after this middleware has to be authenticated.

	router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });



// ==========================================================
// 		 								GET PROFILE
// ==========================================================

	router.get('/userProfile', (req, res) => {
		// Find the unique user id of the user from decoded token. The userId is stored in the token in the login route.
		User.findOne({ _id: req.decoded.userId }).select('name username email password').exec((err, user) => {
			// Check if there is error.
			if(err){
				// Respond if there is error.
				res.json({ success: false, message: err });
				// Check if the user exist.
			}else if (!user) {
				// Respond if the user is not exist.
				res.json({ success: false, message: 'No user was found'});
			}else {
				// If there is user, send it to the front.
				res.json({ success: true, user: user });
			}
		})
	})

return router;
}
