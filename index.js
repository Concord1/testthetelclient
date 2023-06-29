// Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');


// Load environment variables
dotenv.config();
const serverapiURL = process.env.GET_FROM_DYNAMODB_API;

// Create Express app
const app = express();

// Set the port
const port = process.env.PORT || 3300;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// Define a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/getfromDynamo', async (request, response) =>{
    // make API call with parameters and use promises to get response
    delete request.headers.host;
    delete request.headers.referer;
    request.body = JSON.stringify(request.body.code)

    try {
        const res = await fetch(serverapiURL, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: 'follow'
        });
        const data = await res.json();
        response.json(data);
    } catch (error) {
        console.log('error', error);
        response.status(500).json({ error: 'An error occurred' });
    }
})