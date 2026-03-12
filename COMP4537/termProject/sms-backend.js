require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/**
 * POST /api/send-sms - Expects JSON body with "to" and "body" fields.
 * Validates input and Twilio credentials, then sends SMS using Twilio API.
 * Responds with success or error message based on the outcome.
 */
app.post('/api/send-sms', async (req, res) => {
    const { to, body } = req.body;

    // Make sure there is a "to" and "body" field in the request
    if (!to || !body) {
        return res.status(400).send('Missing "to" or "body" fields.');
    }

    // Get the Twilio credentials from env
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    // Validate that the credentials are present and look correct (SID should start with "AC")
    if (!sid || !sid.startsWith('AC') || !token) {
        return res.status(500).send('Twilio credentials are not configured. Fill in .env with your real Account SID, Auth Token, and phone number.');
    }

    // Initialize Twilio client with SID and token
    const client = twilio(sid, token);

    // Try to send the message using Twilio API, and handle any errors that may occur
    try {
        const message = await client.messages.create({
            body, // Body of the message
            from: process.env.TWILIO_PHONE_NUMBER, // The Twilio phone number to send from
            to // The recipient's phone number
        });
        console.log(`SMS sent: ${message.body}, To: ${message.to}`);
        res.status(200).send(`Message sent successfully. Message: ${message.body}, To: ${message.to}`);
    } catch (err) {
        console.error('Twilio error:', err.message);
        res.status(500).send(`Failed to send message: ${err.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`SMS backend running at http://localhost:${PORT}`);
});
