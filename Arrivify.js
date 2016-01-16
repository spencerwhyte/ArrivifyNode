var twilio = require('twilio');

// Load the SID and auth token from the environment so that it isn't
// in source control
var client = new twilio.RestClient()

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());

app.post('/api/v1/notification/send', function (req, res) {

	console.log(req.body)
	
	var message = req.body.message;
	var recipients = req.body.recipients;
	if(message && message.length != 0){
		console.log("Message: " + message)
		console.log("Recipients: " + recipients)
		message = "Arrivify: " + message
		var successArray = []
		var failureArray  = []

		for(i in recipients){
		    var recipient = recipients[i];
		    // Pass in parameters to the REST API using an object literal notation. The
		    // REST client will handle authentication and response serialzation for you.
		    client.sms.messages.create({
			to:recipient,
			from:'+12048179112',
			body:message
		    }, function(error, message) {
			    if (!error) {
				console.log('Success! The SID for this SMS message is:');
				console.log(message.sid);
		 
				console.log('Message sent on:');
				console.log(message.dateCreated);
				
				successArray.push(recipient);	
			    } else {
				console.log('Oops! There was an error.');
				console.log(error);
				
				failureArray.push(recipient)
			    }
		    		
			    if(successArray.length + failureArray.length == recipients.length){
				console.log("The last text message just went out")
				
				var responseObject = {
		                    successes : successArray,
                	   	    failures  : failureArray
             		    	};  
            		        res.send(JSON.stringify(responseObject))
			    }
		} );
	    }
	}else{
		var responseObject = {
			error:"The provided message was empty"
		};
		res.send(JSON.stringify(responseObject))
	}
});

app.listen(8002, function () {
  console.log('Listening on port 8080!');
});

