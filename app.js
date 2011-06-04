// load vendor modules
var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    mongoose		= require('mongoose');

// load models
require('./schema/schema');

// load custom modules
var core			= require('./lib/core'),
	menu			= require('./lib/menu'),
	channel			= require('./lib/channel');

// initialize other vars
var	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId,
    app 			= express.createServer();

// connect database
mongoose.connect('mongodb://localhost/timerime-reloaded');

// set template path
core.template_loader.set_path('templates');

// disable template cache
core.template_loader.disableCache();

// setup express app
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'very secret secret'}));

//make static files available
app.use("/web", express.static(__dirname + '/web'));

app.use('/', channel.init);

// init controllers
require('./controllers/auth')(app);
require('./controllers/timeline')(app);
require('./controllers/timeline_edit')(app);

app.get('/about', function(req, res){
	core.render('about.html', {}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
        	res.send(result);
        }
    });
});

// listen
app.listen(3000);
