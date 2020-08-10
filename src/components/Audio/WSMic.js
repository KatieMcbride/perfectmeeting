import React, { useEffect, useState, useRef } from 'react';
import TransacriptWindow from './TransacriptWindow'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

let socket;

export default function WSMic() {
    const [recording, setRecording] = useState(false)
    const [thinking, setThinking] = useState(false)
    const [messages, setMessages] = useState([]);
    let [numSpeakers, setNumSpeaksers] = useState(1)
    // let socket = useRef(null)
    let audio_context = useRef(null)
    let mediaStream = useRef(null)

    useEffect(() => {
        console.log("- start -");
        fetch("http://localhost:8084/health-check")
            .then((result) => {
                // TODO: enable button
            }).catch(function () {
                alert("api down?");
                // TODO: disable button
            });
        return () => {
            if (audio_context) {
                audio_context.current.stop()
            }
            socket.close();
        }
    }, []);

    React.useEffect(() => {
        console.log("set recording:", recording);
    }, [recording]);

    function activateAudio(e) {
        console.log("- activateAudio -");
        setThinking(true);
        // Setup context before socket, so we can get sampleRate
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            audio_context.current = new AudioContext();
            // check navigator
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            if (!navigator.getUserMedia) {
                alert("mic not working");
                // TODO: recirect back, or something...
                return;
            }
        } catch (e) {
            alert('No web audio support in this browser!');
            // TODO: recirect back, or something...
            return;
        }
        init();
    }

    function stopAudio(e) {
        stopRecording();
    }

    function init() {
        console.log("- init -");
        if (!audio_context || audio_context.current) {
            audio_context.current = new AudioContext();
        }
        // Setup Websocket
        const sampleRate = audio_context.current.sampleRate;
        var url;
        if (window.location.protocol === 'https:') {
            url = 'wss://localhost:8084/record?sampleRate=' + sampleRate + "&numSpeakers=" + numSpeakers;
        } else {
            url = 'ws://localhost:8084/record?sampleRate=' + sampleRate + "&numSpeakers=" + numSpeakers;
        }
        console.log("connecting to:", url);
        socket = new WebSocket(url);
        socket.binaryType = "arraybuffer";
        socket.onopen = () => {
            console.log("initMidia");
            navigator.getUserMedia({ audio: true }, (stream) => {
                console.log("startUserMedia");

                var recordingSet = false;

                mediaStream.current = audio_context.current.createMediaStreamSource(stream);
                // // const processor = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);
                const processor = audio_context.current.createScriptProcessor(4096, 1, 1); // 1024, 2, 2 ?
                processor.onaudioprocess = (e) => {
                    const data = e.inputBuffer.getChannelData(0);
                    // only send if there is non-zero data
                    if (data.length > 3 && data[0] !== 0 && data[1] !== 0 && data[2] !== 0) {
                        if (!recordingSet) {
                            setThinking(false);
                            setRecording(true);
                            recordingSet = true;
                        }
                        socket.send(data);
                    }
                };
                mediaStream.current.connect(processor);
                processor.connect(audio_context.current.destination);

                console.log('Recorder initialised.');
            }, function (e) {
                console.log('No live audio input: ' + e);
                alert('Unable to setup microphone');
                // TODO: recirect back, or something...
            });
        }
        socket.onclose = (e) => {
            console.log("socket closed for some reason....", e);
            stopRecording();
        }
        socket.onerror = (e) => {
            console.log("socket error", e);
            alert('error connecting to recording server');
            // TODO: recirect back, or something...
        }
        socket.onmessage = (e) => {
            console.log("socket.onmessage:", e.data)
            let m = [];
            try {
                // const message = e.data.slice(1, -2);
                // var js = atob(message);
                // var data = JSON.parse(js);
                var data = JSON.parse(e.data);
                console.log(data);

                for (let i = 0; i < data.words.length; i++) {
                    const word = data.words[i];
                    m.push(getMessage(word, data, i))
                    // TODO: maybe find hightest if not already [0]
                    // const alt = result.alternatives[0];

                    // if (alt.words) {
                    //     for (let j = 0; j < alt.words.length; j++) {
                    //         const word = alt.words[j];
                    //         m.push(getMessage(word, alt, j))
                    //     }
                    // } else {
                    //     m.push(getMessage(null, alt, i));
                    // }
                }
            } catch (error) {
                // bad data??? 
            }

            setMessages(m);
        }
    }

    function getMessage(word, alt, id) {
        let message = {};

        // don't let word go beyond .5, otherwise it will be invisible
        message.confidence = Math.max(alt.confidence, 0.5);
        if (word.speaker) {
            message.speaker = "speaker_" + word.speaker;
        }
        message.text = word.word + " ";
        message.id = id;
        return message;
    }

    function stopRecording(d) {
        console.log("stopRecording", d);
        setRecording(false);

        console.log('Stopped recording.');

        // try to shut off mic
        mediaStream && mediaStream.current && mediaStream.current.mediaStream.getTracks()[0].stop();

        // try to stop socket
        socket.close();
    }

    return (
        <React.Fragment>
            <main>
                {!recording && !thinking &&
                    <>
                        <TextField
                            id="outlined-number"
                            label="Number of people"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={numSpeakers}
                            onChange={e => setNumSpeaksers(e.target.value)}
                        />
                        <br></br>
                        <br></br>
                        <Button variant="contained" color="secondary" size="large" onClick={activateAudio} >
                            Start
                    </Button>
                    </>
                }
                {thinking &&
                    <CircularProgress />
                }
                {recording &&
                    <Button variant="contained" color="primary" size="large" onClick={stopAudio} >
                        End Meeting
                    </Button>
                }
                <TransacriptWindow messages={messages} />
            </main>
        </React.Fragment>
    );
}
