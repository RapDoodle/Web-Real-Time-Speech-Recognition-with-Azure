# Web Real-time Speech Recognition with Azure

An example project that provides a web interface to real-time speech-to-text service on a browser with Azure real-time speech-to-text service and Socket.IO.

## Usage

1. Install the dependencies

```bash
$ npm install
```

2. Set `AZURE_KEY` and `AZURE_REGION` as environment variable.

For Linux/macOS users
```bash
export AZURE_KEY=YOU_AZURE_KEY
export AZURE_REGION=YOUR_AZURE_REGION
```

For Windows PowerShell
```bash
$env:AZURE_KEY = 'YOU_AZURE_KEY'
$env:AZURE_REGION = 'YOUR_AZURE_REGION'
```

3. Start the backend

```bash
$ npm run start
```

1. Go the the frontend

By default, the frontend is served at `http://127.0.0.1:4000/`