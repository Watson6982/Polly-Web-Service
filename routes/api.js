var express = require('express');
var router = express.Router();
var cors = require('cors');
//aws
var AWS = require('aws-sdk')
var Fs = require('fs')
// aws polly
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
});

//var whitelist = ['http://localhost:3000/test','http://test.com','http://localhost:3000/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//console.log(corsOptions);

// landing page
router.post('/', /*cors(corsOptions),*/ (req, res) => {
		//aws voice params
		//console.log(corsOptions);
		let params = {
		'Text': req.body.keyname,
		'OutputFormat': 'mp3',
		'VoiceId': req.body.person
		}
		//voice synth
		sendTextToPolly(params, res);
	}
);

router.get('/', /*cors(corsOptions),*/ (req, res) => {
		//aws voice params
		let params = {
		'Text': req.query.keyname,
		'OutputFormat': 'mp3',
		'VoiceId': req.query.person
		}
		//voice synth
		sendTextToPolly(params, res, req);
	}
);

function sendTextToPolly(params, res, req) {
		//date variation for voice file name
		var dt = Date.now();

		if (!params.Text) {
			params.Text = 'You have not submitted any text';
		}

		if (!params.VoiceId) {
			params.VoiceId = 'Joey';
		}

		Polly.synthesizeSpeech(params, (err, data) => {
		if (err) {
			console.log(err.code)
		} else if (data) {
			if (data.AudioStream instanceof Buffer) {
				Fs.writeFile("./public/assets/audio/speech"+ dt +".mp3", data.AudioStream, function(err) {
					if (err) {
						return console.log(err)
					}
					console.log("The file was saved!")

					//If successful return the voice file as a json object
					res.status(200).json({file: "https://" + req.headers.host + "/assets/audio/speech"+ dt +".mp3"})
				})
			}
		}
	})
}

module.exports = router;