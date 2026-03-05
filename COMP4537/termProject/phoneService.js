// phoneService.js — browser-side only
// Sends a POST request to the backend which handles Twilio.

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
    const toPhoneNumber = document.getElementById("to-phone-number").value.trim();
    const messageBody = document.getElementById("message-body").value.trim();

    if (!toPhoneNumber) {
        alert("Please enter a phone number.");
        return;
    }
    if (!messageBody) {
        alert("Please enter a message.");
        return;
    }

    sendMessage(toPhoneNumber, messageBody).catch(err => {
        console.error("Error sending message:", err);
        alert("Network error: " + err.message);
    });
});

async function sendMessage(toPhoneNumber, messageBody) {
    const res = await fetch("http://localhost:3002/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toPhoneNumber, body: messageBody })
    });

    const text = await res.text();

    if (res.ok) {
        alert("Message sent!");
        console.log("Response:", text);
    } else {
        alert(`Error (${res.status}): ${text}`);
        console.error("Send error:", text);
    }
}
