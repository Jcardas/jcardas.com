// Import note logic from notes.js
import {Note, NoteManager} from './notes.js';
import {messages} from '../lang/messages/en/user.js';

/**
 * NavButton Class.
 */
class NavButton
{
    constructor(title, url)
    {
        this.title = title;
        this.url = url;
    }

    /**
     * Returns the completed navButton object
     */
    display()
    {
        const button = document.createElement("a");
        button.innerText = this.title;
        button.href = this.url;
        button.className = "nav-button";

        return button;
    }
}

class NavBar
{
    constructor(targetElement)
    {
        // Validate the container / target exists
        if (!targetElement) return;

        this.container = targetElement;
        this.display();
    }

    display()
    {
        // store all the buttons in an array
        const buttons = [
            new NavButton("Writer", "writer.html"),
            new NavButton("Reader", "reader.html")
        ]

        // Append the buttons to the navbar container
        buttons.forEach(button =>
        {
            this.container.appendChild(button.display());
        })
    }
}

class Footer
{
    constructor(targetElement)
    {
        if (!targetElement) return;

        this.container = targetElement;
        this.display();
    }

    display()
    {
        // Array of buttons (Just one for now, for this lab)
        const buttons = [
            new NavButton("Back", "index.html")
        ]

        // Append the buttons to the parent container
        buttons.forEach(button =>
        {
            this.container.appendChild(button.display());
        })
    }
}

/**
 * Renders all the UI for the page, including navigation.
 */
class UI
{
    constructor()
    {
        this.init() // Initialization logic, basically this is called when UI is instantiated.
    }

    init()
    {
        const navContainer = document.getElementById("navContainer");

        if (navContainer)
        {
            new NavBar(navContainer);
        }

        // Update the last updated message every two seconds
        this.updateTimeDisplay()
        setInterval(() => this.updateTimeDisplay(), 2000); // 2000ms = 2s

        const noteContainer = document.getElementById("noteContainer");
        if (noteContainer)
        {
            this.displayNotes(noteContainer);
            this.displayAddNoteButton(noteContainer);
        }

        const footerContainer = document.getElementById("footer");

        if (footerContainer)
        {
            new Footer(footerContainer);
        }
    }

    displayNotes(noteContainer)
    {
        // Get the notes from the local storage in the browser
        const notes = NoteManager.loadNotesFromLocalStorage();

        // Display each of the notes in the ui
        notes.forEach(note =>
        {
            noteContainer.appendChild(note.getElement());
        });
    }

    displayAddNoteButton(noteContainer)
    {
        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.innerText = "Add Note";

        addButton.onclick = () => {
            const newNote = new Note();
            NoteManager.addNote(newNote);
            noteContainer.appendChild(newNote.getElement());
        };

        noteContainer.appendChild(addButton);
    }

    updateTimeDisplay()
    {
        const lastUpdated = document.getElementById("lastUpdated");
        if (lastUpdated)
        {
            const time = new Date(NoteManager.lastUpdated);
            lastUpdated.innerText = time.toLocaleTimeString();

        }
    }
}

document.addEventListener("DOMContentLoaded", () =>
    {
        const ui = new UI();
    }
)

