document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('generate-image-form');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const input = document.getElementById('image-prompt').value;
  
      // API endpoint URL
      const url = 'https://api.openai.com/v1/images/generations';
  
      // Request parameters
      const params = {
        prompt: input,
        n: 1,
        size: '512x512',
      };
  
      // API request options
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify(params),
      };
  
      // Send API request
      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          const imageUrl = data.data[0].url;
          const image = document.createElement('img');
          image.src = imageUrl;
          document.getElementById('generated-image').appendChild(image);
        })
        .catch(error => console.error(error));
    });
  });
  