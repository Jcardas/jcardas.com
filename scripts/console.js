const initializerDiv = document.getElementById("initializer");

let inputField = document.getElementById("input");
const inputContainer = document.getElementById("input-container");

const bootSequence = [
    "Initializing System...",
    "Loading Kernel Modules...",
    "Connecting to Mainframe...",
    "All Systems Operational!",
    "Type 'start' to begin or 'projects' to see a list."
];

function printToInitializer(text) {
    initializerDiv.innerHTML += text + "<br>";
    initializerDiv.scrollTop = initializerDiv.scrollHeight;
}

// Simulate Boot Sequence
let i = 0;

function runBootSequence() {
    if (i < bootSequence.length) {
        printToInitializer(bootSequence[i]);
        i++;
        setTimeout(runBootSequence, 100); // Adjust delay between messages
    } else {
        inputContainer.style.display = "flex";
        inputField.focus();
    }
}

runBootSequence();

// Console functionality
let consoleCounter = 1; // Initialize a counter for console divs

function printToConsole(text) {
    let consoleDiv = document.createElement("div");

    // Set the unique ID for each console div
    consoleDiv.id = "console-output[" + consoleCounter + "]";
    consoleCounter++;  // Increment the counter for the next console div

    consoleDiv.classList.add("console", "new");
    consoleDiv.innerHTML = text + "<br>";
    consoleDiv.scrollTop = consoleDiv.scrollHeight;

    document.body.appendChild(consoleDiv);  // Append the new console div to the body or the desired container
}

inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        let command = inputField.value.toLowerCase().trim(); // send the inputted string to the processCommand()
        processCommand(command);

        if (command !== "clear")
        {
            // After the command is processed, initialize a new input field again
            initializeNewInputField();
        }
    }
});

function initializeNewInputField() {

    let oldInputContainer = document.getElementById("input-container"); // get the old input div

    let newInputContainer = oldInputContainer.cloneNode(true); // Create a new input div clone


    // Mark the old input as class = old
    oldInputContainer.classList.add("old-input-container", "new");
    oldInputContainer.querySelector("input").classList.add("old-input", "new");
    oldInputContainer.querySelector("span").classList.add("old-prompt", "new");


    // Remove the old input's ID
    oldInputContainer.removeAttribute("id");
    oldInputContainer.querySelector("input").removeAttribute("id");
    oldInputContainer.querySelector("span").removeAttribute("id");

    // Make the old input immutable
    oldInputContainer.querySelector("input").disabled = true;

    // Set the new input's class to "new" for tagging of user generated lines.
    newInputContainer.classList.add("new");


    // Clear the new inputs value
    newInputContainer.querySelector("input").value = "";

    document.body.appendChild(newInputContainer);


    // Now we attach the event listener to the new input field
    let newInputField = newInputContainer.querySelector("input");

    newInputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            let command = newInputField.value.toLowerCase().trim(); // send the inputted string to processCommand()
            processCommand(command);

            if (command !== "clear")
            {
                // After the command is processed, initialize a new input field again
                initializeNewInputField();
            }
        }
    });

    // Focus the new input field
    newInputField.focus();


}

function processCommand(command) {
    printToConsole("> " + command);

    if (command === "start") {
        printToConsole("Welcome to my console! Type 'help' for available commands.");
    } else if (command === "projects") {
        printToConsole("1. Web Console\n2. Portfolio Website\n3. Game Dev Project");
    } else if (command === "hello") {
        printToConsole("Hello! :^)");
    } else if (command === "help") {
        printToConsole("Available commands: start, hello, projects, help, clear");
    } else if (command === "clear") {

        clear();


    } else {
        printToConsole("Unknown command. Type 'help' for a list of commands.");
    }
}


function clear() {
    // Remove all previous console output and input fields
    document.querySelectorAll(".console, .old-input-container, #input-container").forEach(el => el.remove());

    // Manually create a new input container instead of cloning
    let newInputContainer = document.createElement("div");
    newInputContainer.id = "input-container";
    newInputContainer.style.display = "flex";

    let promptSpan = document.createElement("span");
    promptSpan.id = "prompt";
    promptSpan.textContent = "jcardas.com:>";

    let newInputField = document.createElement("input");
    newInputField.type = "text";
    newInputField.id = "input";
    newInputField.autofocus = true;
    newInputField.autocomplete = "off";

    // Append everything
    newInputContainer.appendChild(promptSpan);
    newInputContainer.appendChild(newInputField);
    document.body.appendChild(newInputContainer);

    // Now we attach the event listener to the new input field
    newInputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            let command = newInputField.value.toLowerCase().trim(); // send the inputted string to processCommand()
            processCommand(command);

            if (command !== "clear")
            {
                // After the command is processed, initialize a new input field again
                initializeNewInputField();
            }
        }
    });

    // Focus the new input field
    newInputField.focus();
}



