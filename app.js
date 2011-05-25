var sys = require('sys'),
    dj = require('./vendor/djangode/djangode.js');
    
dj.serve(dj.makeApp([
  ['^/$', function(req, res) {
    dj.respond(res, '<h1>Homepage</h1>');
  }],
  ['^/page/(\\d+)$', function(req, res, page) {
    dj.respond(res, '<h1>Page ' + page + '</h1>');
  }]
]), 8000);