//UPDATED

// server1/client-script.js
const insertButton = document.getElementById('insert-btn');
const submitButton = document.getElementById('submit-query');
const sqlTextarea = document.getElementById('sql-query');
const responseArea = document.getElementById('response-area');

const portNumber = 3001;

// When clicked, the insert button will send a request to the server to insert default data into the database.
insertButton.addEventListener('click', () =>
{

    // if there is an error sending the request, catch it and display it in the response area
    sendInsert().catch(err =>
    {
        console.error(`Error sending insert to server on port ${portNumber}:`, err);
        responseArea.textContent = `Network error: ${err.message}`;
    });
});

// When clicked, the submit button will send the SQL query from the textarea to the server and display the response.
submitButton.addEventListener('click', () =>
{
    // Get the SQL query from the textarea and trim whitespace
    const sql = sqlTextarea.value.trim();

    // If the textarea is empty, display a message and return early
    if (!sql)
    {
        responseArea.textContent = 'Please enter a SQL query.';
        return;
    }
    // if there is an error sending the request, catch it and display it in the response area
    sendQuery(sql).catch(err =>
    {
        console.error(`Error sending query to server on port ${portNumber}:`, err);
        responseArea.textContent = `Network error: ${err.message}`;
    });
});

// Async function to send a POST request to the server to insert default data into the database.
async function sendInsert()
{
    // Send a POST request to the /api/insert endpoint with
    // a simple text body to trigger the insert operation on the server.
    const res = await fetch(`/api/insert`, {
        method: 'POST', // Use POST method for insert operation
        headers: {'Content-Type': 'text/plain'}, // Set content type to plain text
        body: 'insert-default-data'  // The actual content of the body is not important for the server
    });

    // Read the response text from the server
    const text = await res.text();

    // If the response is successful, display the response text in the response area.
    if (res.ok)
    {
        responseArea.textContent = text;
        console.log(`Insert response:`, text);
    } else // If the response is an error, display the error message in the response area and log it to the console.
    {
        responseArea.textContent = `Error (${res.status}): ${text}`;
        console.error(`Insert error (${res.status}):`, text);
    }
}

// Async function to send a GET request to the server with the SQL query and display the response.
async function sendQuery(sql)
{
    // Send a GET request to the /api/query endpoint with the SQL query as a URL parameter.
    const url = `/api/query?sql=${encodeURIComponent(sql)}`;

    // Fetch the response from the server.
    // The server will execute the SQL query and return the results or an error message.
    const res = await fetch(url, {method: 'GET'});

    // Check the content type of the response to determine how to parse it.
    const contentType = res.headers.get('content-type') || '';

    // If the response is JSON, parse it as JSON. Otherwise, read it as plain text.
    if (contentType.includes('application/json'))
    {
        // Parse the JSON response from the server.
        // If the response is successful, display the results in a formatted way.
        // If it's an error, display the error message.
        const json = await res.json();
        if (res.ok)
        {
            responseArea.textContent = JSON.stringify(json, null, 2);
            console.log('Query results:', json);
        } else
        {
            responseArea.textContent = `Error (${res.status}): ${json.error || JSON.stringify(json)}`;
            console.error('Query error:', json);
        }
    } else // If the response is not JSON, read it as plain text and display it.
        // This is for handling error messages that may not be in JSON format.
    {
        const text = await res.text();
        if (res.ok)
        {
            responseArea.textContent = text;
        } else
        {
            responseArea.textContent = `Error (${res.status}): ${text}`;
            console.error('Query error:', text);
        }
    }
}
