document.addEventListener('DOMContentLoaded', function() {
  // Get the HTML elements
  const recordBtn = document.querySelector("#record-btn");
  const playBtn = document.querySelector("#play-btn");
  const transcribeBtn = document.querySelector("#transcribe-btn");
  const audioInput = document.querySelector("#audio-input");
  const timer = document.querySelector("#timer");

  let recorder; // MediaRecorder object
  let audioBlob; // Blob object of the recorded audio
  let audioURL; // URL of the recorded audio
  let isRecording = false;
  let startTime;
  let timerInterval;

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
  function stopRecording() {
    clearInterval(timerInterval);
    recorder.stop();
    recorder.ondataavailable = (event) => {
      audioBlob = event.data;
      // Save the audio file URL for playback
      audioURL = URL.createObjectURL(audioBlob);
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

    // Send the audio file to the back-end URL for transcription
    const formData = new FormData();
    formData.append('audioFile', audioBlob);

    const response = await fetch('https://us-central1-api-project-1058745121639.cloudfunctions.net/audio/transcribe', {
      method: 'POST',
      body: formData
    });

    const transcriptionResult = await response.json();
    console.log('Transcription result:', transcriptionResult);

    // Display the transcription result to the user
    // const messageFromAI = await main('Say something to start', transcriptionResult);
    // console.log('Message from AI:', messageFromAI);

    // Do something with the message from the AI
  });
});
