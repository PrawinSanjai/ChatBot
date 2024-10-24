const apiKey = 'AIzaSyAQPa-b6HHfp0HqzCYJcArlT8vM9wJT0Oo';

const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');

// Use CORS Anywhere proxy to bypass CORS
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://gemini.googleapis.com/v1/chat/completions';

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const input = inputField.value;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
    
    // Clear input field
    inputField.value = '';

    // Add user input to conversation
    let userMessage = document.createElement('div');
    userMessage.classList.add('chatbot-message', 'user-message');
    userMessage.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
    conversation.appendChild(userMessage);

    // Generate chatbot response using the Gemini API
    generateResponse(input, currentTime);
});

// Generate chatbot response function
function generateResponse(input, currentTime) {
    const requestData = {
        model: 'gemini-1.0-pro', // Replace with the actual model name
        messages: [{ role: 'user', content: input }]
    };

    console.log('Sending request with data:', requestData); // Debugging log

    fetch(proxyUrl + apiUrl, { // Use the proxy URL to bypass CORS
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        console.log('Response received:', response); // Debugging log

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Debugging log
        if (data && data.choices && data.choices.length > 0) {
            const generatedText = data.choices[0].message.content; 

            // Add chatbot response to conversation
            let botMessage = document.createElement('div');
            botMessage.classList.add('chatbot-message', 'chatbot');
            botMessage.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${generatedText}</p>`;
            conversation.appendChild(botMessage);
            botMessage.scrollIntoView({ behavior: "smooth" });
        } else {
            // Handle unexpected response structure
            let errorMessage = document.createElement('div');
            errorMessage.classList.add('chatbot-message', 'chatbot');
            errorMessage.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">Sorry, I didn't get a response.</p>`;
            conversation.appendChild(errorMessage);
            errorMessage.scrollIntoView({ behavior: "smooth" });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, display an error message in the chat
        let errorMessage = document.createElement('div');
        errorMessage.classList.add('chatbot-message', 'chatbot');
        errorMessage.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">Sorry, there was an error processing your request.</p>`;
        conversation.appendChild(errorMessage);
        errorMessage.scrollIntoView({ behavior: "smooth" });
    });
}
