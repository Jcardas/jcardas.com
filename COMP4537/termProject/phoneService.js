// phoneService.js — browser-side only
// Sends a POST request to the backend which handles Twilio.

const sendButton = document.getElementById("send-button");

// Add click event listener to the send button
sendButton.addEventListener("click", () => {
    const toPhoneNumber = document.getElementById("to-phone-number").value.trim();
    const messageBody = document.getElementById("message-body").value.trim();

    // Validate input fields before sending
    if (!toPhoneNumber) {
        alert("Please enter a phone number.");
        return;
    }
    if (!messageBody) {
        alert("Please enter a message.");
        return;
    }

    // Send the message using the sendMessage function.
    sendMessage(toPhoneNumber, messageBody).catch(err => {
        console.error("Error sending message:", err);
        alert("Network error: " + err.message);
    });
});

/**
 * Sends a POST request to the backend API to send an SMS message.
 * @param toPhoneNumber - The recipient's phone number
 * @param messageBody - The body of the message to send
 */
async function sendMessage(toPhoneNumber, messageBody) {
    const res = await fetch("http://localhost:3002/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toPhoneNumber, body: messageBody })
    });

    // Read the response text (success message or error details)
    const text = await res.text();

    // If the response is OK (status 200), alert success. Otherwise, alert the error message.
    if (res.ok) {
        alert("Message sent!");
        console.log("Response:", text);
    } else {
        alert(`Error (${res.status}): ${text}`);
        console.error("Send error:", text);
    }
}
