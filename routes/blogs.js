const Blog = require('../models/blog');
const User = require('../models/user');

const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {


// ==========================================================
//										POST NEW BLOG
// ==========================================================
	router.post('/newBlog', (req, res) => {
		// Check if there is title
		if(!req.body.title){
			// Respond if there is no title.
			res.json({ success: false, message: 'Title is required.'});
			// Check if there is a body.
		}else if (!req.body.body) {
			// Respond if there is no body.
			res.json({ success: false, message: 'Body is required.'});
			// Check if there is an author for the blog.
		}else if(!req.body.createdBy){
			// Respond if there is no author.
			res.json({ success: false, message: 'Author is required.'});
		}else if(!req.body.username){
			// Respond if there is no username.
			res.json({ success: false, message: 'Author is required.'});
		}else{
			// Store all the incoming input fields in the blog object based on the schema.
			const blog = new Blog({
				title: req.body.title,
				body: req.body.body,
				createdBy: req.body.createdBy,
				username: req.body.username
			})

			// Save the blog object.
			blog.save((err, blog) => {
				// Check if there is error while saving.
				if(err){
					// Check if it is validation error.
					if(err.errors){
						// Check if it is title validaiton error.
						if(err.errors.title){
							// Respond with title validation error, if there is error.
							res.json({ success: false, message: err.errors.title.message });
							// Check if it is body validaiton error.
						}else if (err.errors.body) {
							// Respond with title validation error, if there is error.
							res.json({ success: false, message: err.errors.body.message });
						}else {
							// Give the save error if there is one.
							res.json({ success: false, message: 'Could not post the blog. Error: ', err });
						}
					}else {
						// If there is error other than validation, respond.
						res.json({ success: false, message: err });
					}
				}else {
					// Respond with Sucess if blog passed validation.
					res.json({ success: true, message: 'Blog successfully posted.', blog: blog });
				}
			})
		}
	});


// ==========================================================
//										GET ALL BLOGS
// ==========================================================
	router.get('/getAllBlogs', (req, res) => {
		// Search database use the Blog schema model.
		Blog.find({}, (err, blogs) => {
			// Check if there is error.
			if(err){
				// Respond if there is any error.
				res.json({ success: false, message: err });
				// Check if there is no blog.
			}else if(!blogs){
				// Respond if there is no blog.
				res.json({ success: false, message: 'No blog was found.'});
				// Otherwise send the blog object.
			}else {
				res.json({ success: true, blog: blogs });
			}
		}).sort({ '_id': -1 }); // Sort from newest to oldest.
	})



// ==========================================================
//										GET SINGLE BLOG
// ==========================================================
	router.get('/singleBlog/:id', (req, res) => {
		// Check if the blog id is provided.
		if(!req.params.id){
			// Respond if the blog id was not provided.
			res.json({ success: false, message: 'No blog id was provided.'})
		}else {
			// Find the single blog based on the id provided.
			Blog.findOne({ _id: req.params.id}, (err, blog) => {
				// Check if there is error in finding blog.
				if(err){
					// Respond if there is any error.
					res.json({ success: false, message: err });
					// Check if the blog is not found.
				}else if (!blog) {
					// Respond if the blog is not found.
					res.json({ success: false, message: 'No blog was found.'});
				}else {
					// Respond with the blog found related to the ID.
					res.json({ success: true, blog: blog });
				}
			})
		}
	})


// ==========================================================
//										UPDATE BLOG
// ==========================================================

router.put('/updateBlog', (req, res) => {
	// Check if the blog id is provided.
	if(!req.body._id){
		// Respond if the blog id is not provided.
		res.json({ success: false, message: 'No blog id was found. '});
	}else {
		// Find the specific blog that user wants to update.
		Blog.findOne({ _id: req.body._id }, (err, blog) => {
			// Check if there is an error finding the blog.
			if(err){
				// Respond if there is error while finding blog.
				res.json({ success: false, message: 'Error occured finding the blog.', err });
				// Check if the blog exist.
			}else if(!blog){
				// Respond if the blog doesn't exist.
				res.json({ success: false, message: 'Blog was not found.'});
			}else {
				// Decrypt the the user token to ensure the authorization to edit this blog.
				User.findOne({ _id: req.decoded.userId}, (err, user) => {
					// Check if there is any error while decoding the token.
					if(err){
						// Respond if there is error while decoding.
						res.json({ success: false, message: 'Error occured finding user.', err});
						// Check if the user exist.
					}else if(!user){
						// Respond if the user doesn't exist.
						res.json({ success: false, message: 'User was not found to edit this blog.'});
						// Check if the username editting the blog is the same who initially posted the blog.
					}else if(user.username !== blog.username){
						// Respond if the username is not the same as the person posted the blog.
						res.json({ success: false, message: 'You are not authroized to edit this blog.'});
					}else {
						// Assign the input fields from edit form to variables and attach to the blog object.
						blog.title = req.body.title;
						blog.body = req.body.body;
						// Save the editted blog.
						blog.save((err) => {
							// Check if there is error while saving the change.
							if(err){
								// Check if there is validation error.
								if(err.errors){
									// Respond if there is input validation error.
									res.json({ success: false, message: 'Please fill the form properly.'})
								}else {
									// Respond if the error is other than validtion.
									res.json({ success: false, message: 'Error occured saving the blog.', err});
								}
							}else {
								// Respond with success when the edit is successfully done and send the edited blog.
								res.json({ success: true, message: 'The changes have successfully saved.', blog: blog });
							}
						})
					}
				})
			}
		})
	}
});


// ==========================================================
//										DELETE BLOG
// ==========================================================
	router.delete('/deleteBlog/:id', (req, res) => {
		if(!req.params.id){
			res.json({ success: false, message: 'No blog id was provided.'});
		}else {
			Blog.findOne({ _id: req.params.id }, (err, blog) => {
				if(err){
					req.json({ success: false, message: 'Error occurred find the blog.', err});
				}else if (!blog) {
					res.json({ success: false, message: 'The blog was not found.'});
				}else {
					User.findOne({ _id: req.decoded.userId }, (err, user) => {
						if(err){
							res.json({ success: false, message: 'Error occurred finding the user.', err});
						}else if (!user) {
							res.json({ success: false, message: 'The user to edit this blog was not found.'});
						}else if(user.username !== blog.username){
							res.json({ success: false, message: 'You are not authorized to delete this blog.'});
						}else {
							blog.remove((err) => {
								if(err){
									res.json({ success: false, message: 'Error occured deleting the blog.', err});
								}else {
									res.json({ success: true, message: 'Blog is successfully deleted.'});
								}
							})
						}
					})
				}
			})
		}
	})

return router;
}
