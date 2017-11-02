const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


// ==========================================================
// 		 									NAME VALIDATOR
// ==========================================================

	// Checks the length of name.
	let nameLengthChecker = (name) => {
		if(!name){
			// If no name return error
			return false;
		}else {
			// If the length is smaller than two or longer than 30 return error.
			if(name.length < 2 || name.length > 30) {
				return false;
			}else {
				// Return valid email.
				return true;
			}
		}
	}

	// Checks valid name.
	let validNameChecker = (name) => {
		if(!name) {
			return false;
		}else {
			// Only charact
			const regExp = new RegExp(/^[a-zA-Z ]+$/);
			return regExp.test(name)
		}
	}


	let nameValidators = [
		{
			validator: nameLengthChecker,
			message: 'Your name must be at least 2 characters but no more than 30.'
		},
		{
			validator: validNameChecker,
			message: 'Your name must not have special characters.'
		}
	]



// ==========================================================
// 		 									USERNAME VALIDATOR
// ==========================================================

	// Checks the length of name.
	let usernameLengthChecker = (username) => {
		if(!username){
			// If no username return error
			return false;
		}else {
			// If the length is smaller than two or longer than 30 return error.
			if(username.length < 3|| username.length > 15) {
				return false;
			}else {
				// Return valid email.
				return true;
			}
		}
	}

	// Checks valid username.
	let validUsernameChecker = (username) => {
		if(!username) {
			return false;
		}else {
			// Only charact
			const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
			return regExp.test(username)
		}
	}


	let usernameValidators = [
		{
			validator: usernameLengthChecker,
			message: 'Your username must be at least 3 characters but no more than 15.'
		},
		{
			validator: validUsernameChecker,
			message: 'Your username must not have special characters.'
		}
	]



// ==========================================================
// 		 									EMAIL VALIDATOR
// ==========================================================

	// Checks the length of email.
	let emailLengthChecker = (email) => {
		if(!email){
			// If no email return error
			return false;
		}else {
			// If the length is smaller than two or longer than 30 return error.
			if(email.length < 3|| email.length > 30) {
				return false;
			}else {
				// Return valid email.
				return true;
			}
		}
	}

	// Checks valid email.
	let validEmailChecker = (email) => {
	  // Check if e-mail exists
	  if (!email) {
	    return false; // Return error
	  } else {
	    // Regular expression to test for a valid e-mail
	    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	    return regExp.test(email); // Return regular expression test results (true or false)
	  }
	};


	let emailValidators = [
		{
			validator: emailLengthChecker,
			message: 'Your email must be at least 3 characters but no more than 30.'
		},
		{
			validator: validEmailChecker,
			message: 'It is not a valid email. Please enter a valid email address.'
		}
	]



// ==========================================================
// 		 									PASSWORD VALIDATOR
// ==========================================================

	// Checks the length of password.
	let passwordLengthChecker = (password) => {
		if(!password){
			// If no password return error
			return false;
		}else {
			// If the length is smaller than two or longer than 30 return error.
			if(password.length < 8|| password.length > 35) {
				return false;
			}else {
				// Return valid password.
				return true;
			}
		}
	}

	// Checks valid password.
	let validPasswordChecker = (password) => {
		if(!password) {
			return false;
		}else {
			// Regular Expression to test if password is valid format
			const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
			return regExp.test(password); // Return regular expression test result (true or false)
		}
	}


	let passwordValidators = [
		{
			validator: passwordLengthChecker,
			message: 'Your password must be at least 8 characters but no more than 35.'
		},
		{
			validator: validPasswordChecker,
			message: 'The password must contain one uppercase letter, uppercase letter, number, and special charactar.'
		}
	]





// ==========================================================
// 		 									USER SCHEMA
// ==========================================================
	const UserSchema = new Schema({
		name: { type: String, required: true, validate: nameValidators },
		username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
		email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
		password: { type: String, required: true, validate: passwordValidators }
	});


// ==========================================================
// 		 									PASSWORD ENCRYPTION
// ==========================================================

// Schema Middleware to Encrypt Password
UserSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};






module.exports = mongoose.model('User', UserSchema);
