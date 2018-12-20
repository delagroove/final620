var express = require('express');
var exphbs  = require('express-handlebars');
var OAuth2 = require('oauth').OAuth2; 
var https = require('https');

var app = express();
var bodyParser = require('body-parser');
var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};


var Twit = require('twit')

var T = new Twit({
  consumer_key:         '4MipgUa1XBgDcnlIBleJsuMeX',
  consumer_secret:      'lCA2lwcRp5IuCKJAP354QDxFl60oHfUBlOmrSjHcOxZ599PdnU',
  access_token:         '14765503-RyQlscnV5SVzqTJIpJJV0OnAxNRQBrX4k33XISDWP',
  access_token_secret:  'Dp0JcmxLYr7MCOM0B4BRHdUq5TT4W8yMO4up6qg2DjTZg',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})


var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running on port ' + port);
});


//APP CONFIG
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//public is the folder your angular application is in.
//This allows your angular app to handle routing when you hit the URL root (/)
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(process.cwd() + '/public'));


//ENDPOINTS

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/2017', function (req, res) {
    res.render('2017');
});

//unauthenticated request

app.get('/twitter/search', function (req, res) {
   T.get('search/tweets', { q: req.query.term, count: 100 }, function(err, data, response) {
    res.send(data);
  })
  
});

app.get('/twitter/search2', function (req, res) {
  T.get('search/fullarchive', { query: req.query.term, count: 100, fromdate: '201710010000', toDate: '201712310000' }, function(err, data, response) {
   res.send(data);
 })
 
});

app.post('/twitter/user', function (req, res) {
    console.log(req.body);
    T.get('user/tweets', { screen_name: req.body.username, count: 100 }, function(err, data, response) {
        console.log(data)
      })

});

