document.addEventListener('DOMContentLoaded', function () {
    const micIcon = document.getElementById('mic-icon');
    const transcript = document.getElementById('transcript');
    let isRecording = false;
    let currentTranscript = '';
    let sentences = [];
    
    function startNewConversation() {
        currentTranscript = '';
        sentences = [];
        transcript.textContent = '';
    }
    
    // Check if the browser supports SpeechRecognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
    
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
    
        micIcon.addEventListener('click', () => {
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
            isRecording = !isRecording;
        });
    
        recognition.addEventListener('start', () => {
            micIcon.classList.add('recording');
            startNewConversation(); // Clear previous text when starting a new conversation
        });
    
        recognition.addEventListener('end', () => {
            micIcon.classList.remove('recording');
            if (isRecording) {
                recognition.start();
            }
        });
    
        recognition.addEventListener('result', (event) => {
            let interimResult = '';
            let finalResult = '';
    
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalResult += event.results[i][0].transcript;
                    sentences.push(finalResult.trim());
                } else {
                    interimResult += event.results[i][0].transcript;
                }
            }
    
            transcript.textContent = currentTranscript + ' ' + sentences.join('. ') + (interimResult ? ' ' + interimResult : '');
        });
    
        recognition.addEventListener('error', (event) => {
            console.error('Error occurred in recognition:', event.error);
        });
    } else {
        micIcon.style.display = 'none';
        transcript.textContent = 'Your browser does not support SpeechRecognition.';
    }
    
});

