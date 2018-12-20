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

var config = {
    "consumerKey": "4MipgUa1XBgDcnlIBleJsuMeX",
    "consumerSecret": "lCA2lwcRp5IuCKJAP354QDxFl60oHfUBlOmrSjHcOxZ599PdnU",
    "accessToken": "14765503-RyQlscnV5SVzqTJIpJJV0OnAxNRQBrX4k33XISDWP",
    "accessTokenSecret": "Dp0JcmxLYr7MCOM0B4BRHdUq5TT4W8yMO4up6qg2DjTZg"
};

var twitter = require('twitter-node-client').Twitter(config);
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running on port ' + port);
});


//TWITTER AUTHENICATION
var token = null;
var oauth2 = new OAuth2(config.consumerKey, config.consumerSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
  }, function (e, access_token) {
        token = access_token;
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
app.post('/twitter/user', function (req, res) {
    
    var data = twitter.getUser(req.body.username, function(error, response, body){
        res.send({
            "error" : error
        });
    }, function(data){
        res.send({
            result : {
                "userData" : data
            }
        });
    });

});

