document.addEventListener('DOMContentLoaded', function () {
    const micIcon = document.getElementById('mic-icon');
    const chatInput = document.getElementById('chat-input');
    let isRecording = false;
    let currentTranscript = '';
    let sentences = [];

    function startNewConversation() {
        currentTranscript = '';
        sentences = [];
    }

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
            startNewConversation();
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

            chatInput.value = currentTranscript + ' ' + sentences.join('. ') + (interimResult ? ' ' + interimResult : '');
            autoResize.call(chatInput);
        });

        recognition.addEventListener('error', (event) => {
            console.error('Error occurred in recognition:', event.error);
        });
    } else {
        micIcon.style.display = 'none';
        chatInput.placeholder = 'Your browser does not support SpeechRecognition.';
    }


});

