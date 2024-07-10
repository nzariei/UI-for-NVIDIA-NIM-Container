function checkForEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const responseBox = document.getElementById('responseBox');
    const userInput = inputField.value;

    if (!userInput) {
        alert("Please enter a message");
        return;
    }

    const requestBody = {
        "model": "meta/llama3-8b-instruct",
        "messages": [
            {
                "role": "user",
                "content": userInput
            }
        ],
        "max_tokens": 1000,
        "stream": false,
        "temperature": 0.1,
        "top_p": 1
    };

    try {
        const response = await fetch('http://0.0.0.0:8000/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const responseData = await response.json();
        const assistantMessage = responseData.choices[0].message.content;

        responseBox.innerHTML += `<div class="user-message">User: ${userInput}</div>`;
        responseBox.innerHTML += `<div class="assistant-message">Assistant: ${assistantMessage}</div>`;
        responseBox.scrollTop = responseBox.scrollHeight; // Scroll to bottom

        inputField.value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the message.');
    }
}
