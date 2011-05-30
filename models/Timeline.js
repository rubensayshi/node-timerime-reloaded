var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	slugify			= require('../utils/slugify.js'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var Timeline = new Schema({
	title		: String,
	slug		: String,
	body		: String,
	author		: ObjectId,
	categories	: [ObjectId],
	coauthors	: [ObjectId],
	created		: Date,
	updated		: Date
});

Timeline.pre('save', function (next) {
	this.slug = slugify(this.title);

	if (this.isNew) {
		this.created = new Date();
	}
	
    next();
});

mongoose.model('Timeline', Timeline);

