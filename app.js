var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    core			= require('./modules/core'),
    app 			= express.createServer();

//set template path
core.template_loader.set_path('templates');

// make static files available
app.use("/web", express.static(__dirname + '/web'));

// require controllers
// require('./controllers/textpage')(app);

// add some more routing
app.get('/', function(req, res){    
	core.render('homepage.html', {menu : 'MENU GOES HERE YEA?'}, function (error, result) {
	    if (error) {
	        console.log(error);
	    } else {
	    	res.send(result);
	    }
	});
});

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
