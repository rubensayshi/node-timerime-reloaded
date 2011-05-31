// load vendor modules
var sys 			= require('sys'),
    mongoose		= require('mongoose'),
	lipsum			= require('../utils/lipsum');

//connect database
mongoose.connect('mongodb://localhost/timerime-reloaded');

// load models
require('../schema/schema');

Category		= mongoose.model('Category');
User			= mongoose.model('User');
Timeline		= mongoose.model('Timeline');
TimelineItem 	= mongoose.model('TimelineItem');

var cats	= 15;
var users	= 10;
var tls		= 20;
var tlis	= 10;

var send	= 0;
var insert	= 0;
var error	= 0;
var start	= new Date().getTime();

console.log("this might take a while (about 1~1.5 ms / item) ...");
console.log("inserting testdata ...");
console.log(cats					+ " categories");
console.log((cats*users)			+ " users");
console.log((cats*users*tls)		+ " timelines");
console.log((cats*users*tls*tlis)	+ " timeline-items");

for (var c = 0; c < cats; c++) {
	var cat = new Category();
	cat.title = 'Category #'+c;
	
	for (var u = 0; u < users; u++) {
		var user = new User();
		user.username = 'User #'+c+' #'+u;
		
		for (var t = 0; t < tls; t++) {
			var timeline = new Timeline();
			timeline.title	= 'Timeline #'+c+' #'+u+' #'+t;
			timeline.body	= lipsum();
			timeline.author = user;
			timeline.categories.push(cat);
			timeline.rating	= (Math.random()*10);
			
			for (var i = 0; i < tlis; i++) {
				var item = new TimelineItem();
				item.title		= 'TimelineItem #'+c+' #'+u+' #'+t+' #'+i;
				item.body		= lipsum();
				item.timeline 	= timeline;
				
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
		
		send++;
		user.save(function (err) {
			  if (err) error++; else insert++;
		});
	}
	
	send++;
	cat.save(function (err) {
		  if (err) error++; else insert++;
	});
}

console.log("done calling all inserts... ("+(new Date().getTime() - start)+")");

setInterval(function() {
	console.log("--"+(new Date().getTime() - start)+"-- \ninsert ["+insert+"] \nerror ["+error+"] \nwaiting for ["+(send - error - insert)+"]");
	if(error + insert == send) {
		console.log("done");
		process.exit(0);
	}
	else
	{
		console.log("not done");
	}
}, 500);
