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

app.post('/api/send-sms', async (req, res) => {
    const { to, body } = req.body;

    if (!to || !body) {
        return res.status(400).send('Missing "to" or "body" fields.');
    }

    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (!sid || !sid.startsWith('AC') || !token) {
        return res.status(500).send('Twilio credentials are not configured. Fill in .env with your real Account SID, Auth Token, and phone number.');
    }

    const client = twilio(sid, token);

    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
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
