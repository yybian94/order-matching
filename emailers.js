var nodemailer = require('nodemailer');

var emailer = (function(){
    return{
        setupSender: function(from){
            var transporter = nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'shangguanyajie83@gmail.com',
            pass: 'shangguanyajie'
        },
        logger: false,
        debug: false 
    },
    {

        from: from,
        headers: {
            'X-Laziness-level': 1000 
        }
    }
    );
            return transporter;
        },
        composeEmail: function(title, body, attachment){
    // Message object
    var message = {
        // Comma separated list of recipients
        to: '<fundplacestest@gmail.com>',

        // Subject of the message
        subject: title,

        // plaintext body
        text: title,

        // HTML body
        html:"<p>"+body+"</p>"
    };
    if (attachment) {

        // An array of attachments
        message.attachments = [
            // String attachment
            {
                filename: 'notes.txt',
                content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: new Buffer(
                    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                    '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                    'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                    'base64'
                    ),

                cid: Date.now(), // should be as unique as possible
            },

            // File Stream attachment
            {
                filename: 'nyan cat ✔.gif',
                path: __dirname + '/assets/nyan.gif',
                cid: 'nyan@example.com' // should be as unique as possible
            }
            ]
        }
        return message;
    }
}
})();
module.exports = emailer;

var setupSender = function(from){
	var transporter = nodemailer.createTransport(
	{
		host: 'smtp.gmail.com',
		port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        	user: 'shangguanyajie83@gmail.com',
        	pass: 'shangguanyajie'
        },
        logger: false,
        debug: false 
    },
    {

    	from: from,
    	headers: {
    		'X-Laziness-level': 1000 
    	}
    }
    );
	return transporter;
}

var composeEmail = function(title, body, attachment){
	// Message object
	var message = {
        // Comma separated list of recipients
        to: '<fundplacestest@gmail.com>',

        // Subject of the message
        subject: title,

        // plaintext body
        text: title,

        // HTML body
        html:"<p>"+body+"</p>"
    };
    if (attachment) {

        // An array of attachments
        message.attachments = [
            // String attachment
            {
            	filename: 'notes.txt',
            	content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
            	filename: 'image.png',
            	content: new Buffer(
            		'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
            		'//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
            		'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
            		'base64'
            		),

                cid: Date.now(), // should be as unique as possible
            },

            // File Stream attachment
            {
            	filename: 'nyan cat ✔.gif',
            	path: __dirname + '/assets/nyan.gif',
                cid: 'nyan@example.com' // should be as unique as possible
            }
            ]
        }
        return message;
    }


