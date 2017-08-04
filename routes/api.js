var express = require('express');
var router = express.Router();

//aws
var AWS = require('aws-sdk')
var Fs = require('fs')
// aws polly
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
});

// landing page
router.post('/', (req, res) => {
		//aws voice params
		let params = {
		'Text': req.body.keyname,
		'OutputFormat': 'mp3',
		'VoiceId': req.body.person
		}
		//voice synth
		sendTextToPolly(params, res);
	}
);

router.get('/', (req, res) => {
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