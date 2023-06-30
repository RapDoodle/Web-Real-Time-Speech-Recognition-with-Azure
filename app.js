require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const azure = require('microsoft-cognitiveservices-speech-sdk');
const WaveFile = require('wavefile').WaveFile;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const azureKey = process.env.AZURE_KEY;
const azureRegion = process.env.AZURE_REGION;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web.html');
});

io.on('connection', (socket) => {
  let audioStream = azure.AudioInputStream.createPushStream();
  let speechConfig = null;
  let audioConfig = null;
  let recognizer = null;

  let transcript = ""

  socket.on('init', (config) => {
    speechConfig = azure.SpeechConfig.fromSubscription(azureKey, azureRegion);
    speechConfig.speechRecognitionLanguage = config['language'];
    audioConfig = azure.AudioConfig.fromStreamInput(audioStream);
    recognizer = new azure.SpeechRecognizer(speechConfig, audioConfig);

    socket.on('audio', (data) => {
      // Convert whatever wav to 16kHz wav
      let wav = new WaveFile(data);
      wav.toSampleRate(16000);
      audioStream.write(wav.toBuffer());
    });
  
    recognizer.recognizing = function (s, e) {
      if (e.result.text) {
        socket.emit('transcript', `${transcript} ${e.result.text}`);
      }
    };
  
    recognizer.recognized = function (s, e) {
      if (e.result.text) {
        transcript = `${transcript} ${e.result.text}`
        socket.emit('transcript', transcript);
      }
    };
  
    socket.on('disconnect', () => {
      recognizer.stopContinuousRecognitionAsync();
      recognizer = undefined;
    });
  
    recognizer.startContinuousRecognitionAsync();

    socket.emit('ready');
  });
});

server.listen(4000, () => console.log('Listening on port 4000'));
