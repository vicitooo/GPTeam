document.addEventListener('DOMContentLoaded', function () {
  async function uploadAudio(file) {
    const response = await fetch('https://us-central1-api-project-1058745121639.cloudfunctions.net/transcribeAudio/check', {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('File format:', result.format);
    } else {
      console.error('Error uploading audio:', await response.text());
    }
  }

  // Example usage
  const inputElement = document.querySelector('input[type="file"]');
  inputElement.addEventListener('change', (event) => {
    const file = event.target.files[0];
    uploadAudio(file);
  });

  const uploadButton = document.querySelector('#upload-button');

  uploadButton.addEventListener('click', () => {
    const file = inputElement.files[0];
    if (file) {
      uploadAudio(file);
    } else {
      console.log('No file selected');
    }
  });

});
