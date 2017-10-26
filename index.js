const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');

const authRoute = require('./routes/authentication')(router);
const blogsRoute = require('./routes/blog')(router);
const contactRoute = require('./routes/contact')(router);


// ==========================================================
// 		 									DATABASE
// ==========================================================

	// Use global promise instead of mongoose.
	mongoose.Promise = global.Promise;

	mongoose.connect(config.uri, {useMongoClient: true}, (err) => {
		if(err){
			console.log('Could not connect to database', err);
		}else {
			console.log('Connected to datase ' + config.db);
		}
	})


// ==========================================================
// 		 									MIDDLEWARES
// ==========================================================

	app.use(cors({ origin: 'http://localhost:4200'}));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.static(__dirname + '/client/dist'));




// ==========================================================
// 		 									ROUTES
// ==========================================================

	app.use('/authentication', authRoute);
	app.use('/blogs', blogsRoute)
	app.use('/contact', contactRoute)

	app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
	});



// ==========================================================
// 		 									SERVER
// ==========================================================

	const port = process.env.PORT || 8080;

	app.listen(port, () => {
		console.log(`Connected to port ${port}`);
	})
