const Blog = require('../models/blog');
const User = require('../models/user');


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
			// Respond if there is no body.
			res.json({ success: false, message: 'Author is required.'});
		}else {
			// Store all the incoming input fields in the blog object based on the schema.
			const blog = new Blog({
				title: req.body.title,
				body: req.body.body,
				createdBy: req.body.createdBy
			})

			// Save the blog object.
			blog.save((err) => {
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
					res.json({ success: true, message: 'Blog successfully posted.'});
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







return router;
}
