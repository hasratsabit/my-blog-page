const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
	uri: 'mongodb://localhost:27017/my-blog-page',
	secret: crypto,
	db: 'my-blog-page'
}
