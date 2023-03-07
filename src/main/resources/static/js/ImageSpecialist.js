document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('generate-image-form');

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const input = document.getElementById('image-prompt').value;

  try {
    const response = await fetch('https://us-central1-api-project-1058745121639.cloudfunctions.net/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: input })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Response is a JSON object
    // {
        // "created": 1589478378,
        // "data": [
        //   {
            // "url": "https://..."
        //   },
        //   {
            // "url": "https://..."
        //   }
        // ]
    //   }
      
    const data = await response.json();
    const image = data.data[0].url;

    const imageContainer = document.getElementById('generated-image');
    imageContainer.innerHTML = `<img src="${image}" />`;
      } catch (error) {
    console.error(error);
  }
});});
