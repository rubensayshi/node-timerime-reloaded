var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	slugify			= require('../utils/slugify'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId,
	queue			= [];

/*
 * Category
 */
var Category = new Schema({
	title		: String,
	slug		: String
});

Category.pre('save', function (next) {
	this.slug = slugify(this.title);	
	
    next();
});

queue.push(function() { mongoose.model('Category', Category); });

/*
 * Channel
 */
var Channel = new Schema({
	title		: String,
	slug		: String
});

Channel.pre('save', function (next) {
	this.slug = slugify(this.title);	
	
    next();
});

queue.push(function() { mongoose.model('Channel', Channel); });

/*
 * User
 */
var User = new Schema({
	username	: String,
	email		: String,
	password	: String,
	salt		: String,
	name		: String,
	created		: Date,
	channel_ids	: [ObjectId],
	acl			: []
});


User.pre('save', function (next) {
	if (this.isNew) {
		this.created = new Date();
	}
	
	next();
});

queue.push(function() { mongoose.model('User', User); });

/*
 * Timeline
 */
var Timeline = new Schema({
	title		: String,
	slug		: String,
	body		: String,
	author_id	: ObjectId,
	category_ids: [ObjectId],
	channel_ids	: [ObjectId],
	coauthor_ids: [ObjectId],
	created		: Date,
	updated		: Date,
	rating		: Number
});

Timeline.pre('save', function(next) {
	/*
	 * set/update slug
	 */
	this.slug = slugify(this.title);

	/*
	 * set created for new timelines
	 */
	if (this.isNew) {
		this.created = new Date();
	}
	
	/*
	 * set updated
	 */
	this.updated = new Date();

    next();
});

queue.push(function() { mongoose.model('Timeline', Timeline); });

/*
 * TimelineItem
 */
var TimelineItem = new Schema({
	slug		: String,
	title		: String,
	body		: String,
	author_id	: ObjectId,
	created		: Date,
	updated		: Date,
	timeline_id	: ObjectId
});

TimelineItem.pre('save', function (next) {
	this.slug = slugify(this.title);	
	
    next();
});

queue.push(function() { mongoose.model('TimelineItem', TimelineItem); });

/*
 * MenuItem 
 */
var MenuItem = new Schema({
	title		: String,
	link		: String,
	children	: [MenuItem]
});


queue.push(function() { mongoose.model('MenuItem', MenuItem); });

/*
 * Flush the queue
 */
queue.forEach(function(fn) {
	fn(); 
});