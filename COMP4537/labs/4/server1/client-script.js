//UPDATED

// server1/client-script.js
const insertButton = document.getElementById('insert-btn');
const submitButton = document.getElementById('submit-query');
const sqlTextarea = document.getElementById('sql-query');
const responseArea = document.getElementById('response-area');

const portNumber = 3001;

insertButton.addEventListener('click', () =>
{
    sendInsert().catch(err =>
    {
        console.error(`Error sending insert to server on port ${portNumber}:`, err);
        responseArea.textContent = `Network error: ${err.message}`;
    });
});

submitButton.addEventListener('click', () =>
{
    const sql = sqlTextarea.value.trim();
    if (!sql)
    {
        responseArea.textContent = 'Please enter a SQL query.';
        return;
    }
    sendQuery(sql).catch(err =>
    {
        console.error(`Error sending query to server on port ${portNumber}:`, err);
        responseArea.textContent = `Network error: ${err.message}`;
    });
});

async function sendInsert()
{
    const res = await fetch(`/api/insert`, {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'},
        body: 'insert-default-data'
    });

    const text = await res.text();
    if (res.ok)
    {
        responseArea.textContent = text;
        console.log(`Insert response:`, text);
    } else
    {
        responseArea.textContent = `Error (${res.status}): ${text}`;
        console.error(`Insert error (${res.status}):`, text);
    }
}

async function sendQuery(sql)
{
    const url = `/api/query?sql=${encodeURIComponent(sql)}`;
    const res = await fetch(url, {method: 'GET'});

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json'))
    {
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
    } else
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
