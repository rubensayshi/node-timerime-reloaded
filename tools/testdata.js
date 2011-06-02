// load vendor modules
var sys 			= require('sys'),
    mongoose		= require('mongoose'),
	lipsum			= require('../utils/lipsum'),
	passwd			= require('../lib/passwd');

//connect database
mongoose.connect('mongodb://localhost/timerime-reloaded');

// load models
require('../schema/schema');

Category		= mongoose.model('Category');
Channel			= mongoose.model('Channel');
User			= mongoose.model('User');
Timeline		= mongoose.model('Timeline');
TimelineItem 	= mongoose.model('TimelineItem');

var chnls	= 3;
var cats	= 9;
var users	= 10;
var tls		= 5;
var tlis	= 10;
var catsarr = [];

var send	= 0;
var insert	= 0;
var error	= 0;
var start	= new Date().getTime();

console.log("this might take a while (about 1~1.5 ms / item) ...");
console.log("inserting testdata ...");
console.log(chnls						+ " channels");
console.log(cats						+ " categories");
console.log((chnls*users)				+ " users");
console.log((chnls*cats*users*tls)		+ " timelines");
console.log((chnls*cats*users*tls*tlis)	+ " timeline-items");

for (var c = 0; c < cats; c++) {
	catsarr[c] = new Category();
	catsarr[c].title = 'Category #'+c;
	
	send++;
	catsarr[c].save(function (err) {
		  if (err) error++; else insert++;
	});
}
	
for (var ch = 0; ch < chnls; ch++) {
	var channel = new Channel();
	channel.title = (ch == 0) ? 'Portal' : 'Channel #'+ch;	
		
	for (var u = 0; u < users; u++) {
		var user = new User();
		user.username 	= 'User #'+c+' #'+u;
		user.salt 		= passwd.salt();
		user.password 	= passwd.md5( 'user' + user.salt );
		user.channel_ids.push(channel);
		user.acl 		= [];
		
		for(var cat in catsarr) {
			for (var t = 0; t < tls; t++) {
				var timeline = new Timeline();
				timeline.title		= 'Timeline #'+c+' #'+u+' #'+t;
				timeline.body		= lipsum();
				timeline.author_id	= user;
				timeline.category_ids.push(cat);
				timeline.channel_ids.push(channel);
				timeline.rating		= (Math.random()*10);
				user.acl.push({edit_timeline: timeline._id});
				
				for (var i = 0; i < tlis; i++) {
					var item = new TimelineItem();
					item.title		= 'TimelineItem #'+c+' #'+u+' #'+t+' #'+i;
					item.body		= lipsum();
					item.timeline_id= timeline;
					
					send++;
					item.save(function (err) {
						  if (err) error++; else insert++;
					});
				}
				
				send++;
				timeline.save(function (err) {
					  if (err) error++; else insert++;
				});
			}
		}
		
		send++;
		user.save(function (err) {
			  if (err) error++; else insert++;
		});
	}
	
	send++;
	channel.save(function (err) {
		  if (err) error++; else insert++;
	});
}

console.log("done calling all inserts... ["+(new Date().getTime() - start)+"ms]");

setInterval(function() {
	console.log("--["+(new Date().getTime() - start)+"ms]-- \ninsert ["+insert+"] \nerror ["+error+"] \nwaiting for ["+(send - error - insert)+"]");
	if(error + insert == send) {
		console.log("done");
		process.exit(0);
	}
	else
	{
		console.log("not done");
	}
}, 1000);
