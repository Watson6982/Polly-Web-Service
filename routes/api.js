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
		//date variation for voice file name
		var dt = Date.now();

		//aws voice params
		let params = {
		'Text': req.body.keyname,
		'OutputFormat': 'mp3',
		'VoiceId': 'Kimberly'
		}
		//voice synth
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
						res.status(200).json({file: "/assets/audio/speech"+ dt +".mp3"})
					})
				}
			}
		})
	}
);

module.exports = router;