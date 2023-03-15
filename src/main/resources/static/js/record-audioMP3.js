document.addEventListener('DOMContentLoaded', function () {
  // Get the HTML elements
  const recordBtn = document.querySelector("#record-btn");
  const playBtn = document.querySelector("#play-btn");
  const transcribeBtn = document.querySelector("#transcribe-btn");
  const audioInput = document.querySelector("#audio-input");
  const timer = document.querySelector("#timer");
  const downloadBtn = document.querySelector("#download-btn");

  let recorder; // MediaRecorder object
  let audioBlob; // Blob object of the recorded audio
  let audioURL; // URL of the recorded audio
  let isRecording = false;
  let startTime;
  let timerInterval;

  async function convertBlobToMp3(blob) {
    const audioContext = new AudioContext();
    const buffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

    const mp3Data = [];
    const blockSize = 1152;
    const samples = new Float32Array(blockSize * channels);
    const numBlocks = Math.ceil(audioBuffer.length / blockSize);

    for (let i = 0; i < numBlocks; i++) {
      for (let channel = 0; channel < channels; channel++) {
        audioBuffer.copyFromChannel(samples, channel, i * blockSize);
      }

      const int16Samples = samples.map(x => x * 32767.5);
      const mp3buf = mp3encoder.encodeBuffer(int16Samples);

      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    const endMp3Buffer = mp3encoder.flush();

    if (endMp3Buffer.length > 0) {
      mp3Data.push(endMp3Buffer);
    }

    const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });
    return mp3Blob;
  }



  // Function to start the recording
  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        recorder = new MediaRecorder(stream);
        recorder.start();
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        isRecording = true;
        recordBtn.textContent = "Stop Recording";
      });
  }

  // Function to stop the recording
  async function stopRecording() {
    clearInterval(timerInterval);
    recorder.stop();
    recorder.ondataavailable = async (event) => {
      audioBlob = event.data;
      // Save the audio file URL for playback and download
      audioURL = URL.createObjectURL(audioBlob);
      console.log('Audio URL:', audioURL);
      downloadBtn.href = audioURL;
      downloadBtn.download = "recorded-audio.mp3";
      downloadBtn.style.display = "inline";
    };
    isRecording = false;
    recordBtn.textContent = "Start Recording";
  }

  // Function to update the timer
  function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Event listener to download the recorded audio when the "Download" button is clicked
  downloadBtn.addEventListener("click", () => {
    if (!audioURL) {
      alert("You need to record and stop the recording first!");
      return;
    }
  });

  // Toggle between starting and stopping the recording when the record button is clicked
  recordBtn.addEventListener("click", () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  // Play the recorded audio when the "Play Recording" button is clicked
  playBtn.addEventListener("click", () => {
    const audio = new Audio(audioURL);
    audio.play();
  });

  // Send the recorded audio to the backend for transcription when the "Transcribe" button is clicked
  transcribeBtn.addEventListener("click", async () => {
    if (!audioBlob) {
      alert("You need to record audio first!");
      return;
    }

    // Convert the audio blob to MP3 format
    const mp3Blob = await convertBlobToMp3(audioBlob);
    console.log("MP3 Blob:", mp3Blob);
    console.log("MP3 Blob mimetype:", mp3Blob.type);

    const formData = new FormData();
    formData.append('audioFile', audioBlob);

    const response = await fetch('https://us-central1-api-project-1058745121639.cloudfunctions.net/transcribeAudio/audio', {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data; boundary=${formData._boundary'
      }
    });

    const transcriptionResult = await response.json();
    console.log('Transcription result:', transcriptionResult);



    // Display the transcription result to the user
    // const messageFromAI = await main('Say something to start', transcriptionResult);
    // console.log('Message from AI:', messageFromAI);

    // Do something with the message from the AI

    

  });

});
