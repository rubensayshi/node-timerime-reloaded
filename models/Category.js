var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	slugify			= require('../utils/slugify.js'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var Category = new Schema({
	title		: String,
	slug		: String
});

Category.pre('save', function (next) {
	this.slug = slugify(this.title);	
	
    next();
});

mongoose.model('Category', Category);

