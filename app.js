var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var moment = require('moment');
var request = require('request');
var emailer = require('./emailers');
var analytics = require('./analytics');
var matcher = require('./matching');


var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

/*app.get('/matchorder', function(req, res){
	request('http://project.fundplaces.com:9091/v1/orders/coin/singapore-mega-mall/buy', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  filterAnN(corseOrderTest);
  populateOrderBook();
  match();
  corseOrderTest = JSON.parse(body);
  res.json(corseOrderTest.resources);
  clear();
});
});*/


app.get('/analytics', function(req, res){
	var buy = req.query.buy;
	/*var startTime = req.query.start?req.query.start:Date.now();
	var endTime = req.query.end;
	var interval = req.query.interval?req.query.interval:1;*/
	var coin_slug = req.query.coin_slug?req.query.coin_slug:"singapore-mega-mall";
	var output;
	if (buy) {
		analytics.calculateLinechart(coin_slug,buy,res, function(res, output){
			res.json(output);
		});	
	} else {
		output = "Please use params '?buy=1' for buy and 0 for sell";
		res.json(output);
	}
});

app.post('/sendEnquiry',function(req,res) {
	var user = req.body.user;
	var title = req.body.title;
	var content = req.body.content;
	var attachment = req.body.attachments;
	var message = emailer.composeEmail(title, content, attachment);
	emailer.setupSender(user).sendMail(message, function(error, info){
		if (error) {
			console.log('Error occurred');
			console.log(error.message);
			var response = {
				status: "Error occured",
				"Error_Message": error.message,
			}
			res.json(response);
			return process.exit(1);
		}
		res.json('Message sent successfully');
		console.log('Message sent successfully!');
		console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        transporter.close();
    });


});

app.post('/matchorder', function(req, res){
	corseOrderTest = req.body;
	console.time("matching")
	matcher.filterAnN(corseOrderTest);
	matcher.populateOrderBook();
	matcher.match();
	var result = matcher.resultCompile();
	res.json(result);
	//dao(result);
	matcher.clear();
	console.timeEnd("matching");

});


var server = app.listen(process.env.PORT || 3000, function(){
	console.log('server starts on port %s', server.address().port); 
})