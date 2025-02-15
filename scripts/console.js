const bootText = [
    "    _                       _",
    "   (_)                     | |",
    "    _   ___  __ _  _ __  __| |  __ _  ___        ___  ___   _ __ ___",
    "   | | / __|/ _` || '__|/ _` | / _` |/ __|      / __|/ _ \\ | '_ ` _ \\",
    "   | || (__| (_| || |  | (_| || (_| |\\__ \\  _  | (__| (_) || | | | | |",
    "   | | \\___|\\__,_||_|   \\__,_| \\__,_||___/ (_)  \\___|\\___/ |_| |_| |_|",
    "  _/ |",
    " |__/"
];


const initializerDiv = document.getElementById("initializer");

let inputField = document.getElementById("input");
const inputContainer = document.getElementById("input-container");

const bootSequence = [
    "Initializing System...",
    "Cortexing Flux Cores...",
    "Loading Kernel Modules...",
    "Defibriling Transistor Modules...",
    "Deleting Cache...",
    "ERROR: Cannot Send Data to Hackers (File Not Found: Personal_Data.txt)",
    "Connecting to Mainframe...",
    ".",
    "..",
    "...",
    "All Systems Operational!",
    "Type 'help' to see a list of commands."
];

function printToInitializer(text)
{
    initializerDiv.innerHTML += text + "<br>";
    initializerDiv.scrollTop = initializerDiv.scrollHeight;
}

// Simulate Boot Sequence
let i = 0;

function runBootSequence()
{
    if (localStorage.getItem("bootSequence") === "fast")
    {
        inputContainer.style.display = "flex";
        inputField.focus();
        return;
    }

    if (i < bootSequence.length)
    {
        printToInitializer(bootSequence[i]);
        i++;
        setTimeout(runBootSequence, 100); // Adjust delay between messages
    } else
    {
        inputContainer.style.display = "flex";
        inputField.focus();
    }
}

displayBootSplash();

// Console functionality
let consoleCounter = 1; // Initialize a counter for console divs

function printToConsole(text)
{
    let consoleDiv = document.createElement("div");

    // Set the unique ID for each console div
    consoleDiv.id = "console-output[" + consoleCounter + "]";
    consoleCounter++;  // Increment the counter for the next console div

    consoleDiv.classList.add("console", "new");
    consoleDiv.innerHTML = text + "<br>";
    consoleDiv.scrollTop = consoleDiv.scrollHeight;

    document.body.appendChild(consoleDiv);  // Append the new console div to the body or the desired container
}

inputField.addEventListener("keypress", function (event)
{
    if (event.key === "Enter")
    {
        let command = inputField.value.toLowerCase().trim(); // send the inputted string to the processCommand()
        processCommand(command);

        if (command !== "clear")
        {
            // After the command is processed, initialize a new input field again
            initializeNewInputField();
        }
    }
});

function initializeNewInputField()
{

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

    newInputField.addEventListener("keypress", function (event)
    {
        if (event.key === "Enter")
        {
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

function activateCheeboMode()
{
    let dots = "";
    let count = 0;

    let loadingInterval = setInterval(() =>
    {
        dots += ".";
        printToConsole("Activating Cheebo Mode" + dots);
        count++;

        if (count >= 3)
        {
            clearInterval(loadingInterval); // Stop the interval after 3 dots
            setTimeout(() =>
            {
                window.location.href = "https://cheebo.online";
            }, 1000); // Small delay before redirecting
        }
    }, 200); // Adds a dot every 0.5 seconds
}


function clear()
{
    // Remove all previous console output and input fields
    document.querySelectorAll(".new, .console, .old-input-container, #input-container").forEach(el => el.remove());

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
    newInputField.addEventListener("keypress", function (event)
    {
        if (event.key === "Enter")
        {
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


// Boot Sequence

function displayBootSplash()
{
    let i = 0;  // Tracks the current line
    let j = 0;  // Tracks the current character in the line

    const preElement = document.getElementById('boot-splash-text');


    function revealLines()
    {
        if (i < bootText.length) //The length of the ARRAY booktext
        {
            if (j < bootText[i].length) // The length of the string at the position i in the booktext Array
            {
                // Add one character at a time from the current line
                preElement.textContent += bootText[i].charAt(j);
                j++; // Move to the next character
                setTimeout(revealLines, 5); // Reveal a character every 5ms
            } else
            {
                // Once a line is complete, move to the next line
                preElement.textContent += '\n'; // Add a line break
                i++; // Move to the next line
                j = 0; // Reset character counter for the next line
                setTimeout(revealLines, 5); // start the next line after a 5ms delay
            }
        }
    }

    function fastReveal()
    {
        bootText.forEach(line => {
            preElement.textContent += line + "\n"; // Add the line and a newline for each string
        });
    }

    if (localStorage.getItem("bootSequence") === "fast")
    {
        fastReveal();
        runBootSequence();
    }
    if (localStorage.getItem("bootSequence") === "default")
    {
        revealLines();
        setTimeout(runBootSequence, 2000);
    }
}

// Matrix text (courtesy of: https://jsfiddle.net/w5wsudd0/)
var c = document.getElementById("c");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = 175;
c.width = window.innerWidth;

//1's and 0's
var matrix_digits = "10";
//converting the string into an array of single characters
matrix_digits = matrix_digits.split("");

var font_size = 10;
var columns = c.width / font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for (var x = 0; x < columns; x++)
    drops[x] = 1;

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#379115"; //green text
    ctx.font = font_size + "px Doto";
    //looping over drops
    for (var i = 0; i < drops.length; i++)
    {
        //a random matric character to print
        var text = matrix_digits[Math.floor(Math.random() * matrix_digits.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 33);

// The commands

let bootMode = null; // Track if the user is in "boot" mode

function processCommand(command) {
    printToConsole("> " + command);

    if (bootMode) {
        if (command === "default") {
            if (localStorage.getItem("bootSequence") === "default") {
                printToConsole("Boot mode is already default.");
            } else {
                printToConsole("Set boot mode to default.");
                localStorage.setItem("bootSequence", "default");
            }
        } else if (command === "fast") {
            printToConsole("Set boot mode to fast.");
            localStorage.setItem("bootSequence", "fast");
        } else {
            printToConsole("Invalid option. Type 'default' or 'fast'.");
            return; // Stay in boot mode
        }
        bootMode = null; // Exit boot mode
        return;
    }

    switch (command) {
        case "about":
            printToConsole("Hi I'm Justin!");
            break;

        case "projects":
            printToConsole("1. Web Console\n2. Portfolio Website\n3. Game Dev Project");
            break;

        case "hello":
            printToConsole("Hello! :^)");
            break;

        case "help":
            printToConsole("Available commands: about, hello, projects, help, clear, boot, reload");
            break;

        case "clear":
            clear();
            break;

        case "boot":
            // Show current boot mode if no additional input is provided
            printToConsole("Boot mode is currently: [" + localStorage.getItem("bootSequence") +
                "]<br>Type 'boot fast' to set to fast or 'boot default' to set to default.");
            break;

        case "boot fast":
            // Change boot mode to fast
            printToConsole("Set boot mode to fast.");
            localStorage.setItem("bootSequence", "fast");
            break;

        case "boot default":
            // Change boot mode to default
            printToConsole("Set boot mode to default.");
            localStorage.setItem("bootSequence", "default");
            break;

        case "reload":
            window.location.reload();
            break;

        default:
            printToConsole("Unknown command. Type 'help' for a list of commands.");
            break;
    }
}