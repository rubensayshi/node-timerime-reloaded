var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	slugify			= require('../utils/slugify.js'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var TimelineItem = new Schema({
	slug		: String,
	title		: String,
	body		: String,
	author		: ObjectId,
	created		: Date,
	updated		: Date,
	timeline	: ObjectId
});

TimelineItem.pre('save', function (next) {
	this.slug = slugify(this.title);	
	
    next();
});

mongoose.model('TimelineItem', TimelineItem);

