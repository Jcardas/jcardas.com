// Written by: Justin Cardas
// Date: 2026-01-16
// Other contributors: Gemini 3-pro (https://gemini.google.com)
// Description: This file contains the UI class that builds the user interface for lab 1.

// Import note logic from notes.js
import {Note, NoteManager} from './notes.js';
import {messages} from '../lang/messages/en/user.js';
import {consts} from '../lang/consts/consts.js';

/**
 * NavButton Class.
 * Used to create navigation buttons for the page.
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
    getElement()
    {
        const button = document.createElement("a");
        button.innerText = this.title;
        button.href = this.url;
        button.className = "nav-button";

        return button;
    }
}

/**
 * The NavBar class builds the navigation bar at the top of the page.
 * (It contains buttons to navigate between Writer and Reader pages)
 */
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
            new NavButton(messages.WRITER_BUTTON, "writer.html"),
            new NavButton(messages.READER_BUTTON, "reader.html")
        ]

        // Append the buttons to the navbar container
        buttons.forEach(button =>
        {
            this.container.appendChild(button.getElement());
        })
    }
}

/**
 * The Footer class builds the footer section of the page.
 * (Currently, it only contains a "Back" button)
 */
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
            new NavButton(messages.BACK_BUTTON, "index.html")
        ]

        // Append the buttons to the parent container
        buttons.forEach(button =>
        {
            this.container.appendChild(button.getElement());
        })
    }
}

/**
 * Builds all the UI for the page, including navigation.
 */
class UI
{
    constructor(mode)
    {
        this.init(mode) // Initialization logic, passes in the mode (Reading/Writing)
    }

    /**
     * Initializes the UI components of the page.
     *
     * @param mode - The mode of the page (Reading or Writing)
     */
    init(mode)
    {
        const navContainer = document.getElementById("navContainer");

        if (navContainer)
        {
            new NavBar(navContainer);
        }

        this.updateTimeDisplay(mode);

        this.refreshNotes(mode);

        const footerContainer = document.getElementById("footer");

        if (footerContainer)
        {
            new Footer(footerContainer);
        }
    }

    /**
     * Refreshes the notes displayed on the page based on the current mode (reading or writing).
     *
     * Method made in collaboration with Gemini 3-pro (https://gemini.google.com)
     * (I previously had 3 different methods, Gemini helped condense it into one)
     * @param mode - The mode of the page (Reading or Writing)
     */
    refreshNotes(mode)
    {
        const noteContainer = document.getElementById("noteContainer");

        if (noteContainer)
        {
            // Clears the container to prevent duplicates
            noteContainer.innerHTML = "";

            // Fetches and creates the note elements from NoteManager
            const notes = NoteManager.getNotesFromLocalStorage(mode);
            notes.forEach(note =>
            {
                noteContainer.appendChild(note.getElement());
            });

            // Adds the "Add Note" button, but only in Writing Mode
            if (mode === consts.WRITING_MODE)
            {
                this.displayAddNoteButton(noteContainer);
            }
        }

        this.updateTimeDisplay(mode);
    }

    /**
     * Displays the "Add Note" button in the note container.
     * Specifically places the button at the end of the notes list.
     * (Writing mode only)
     * @param noteContainer
     */
    displayAddNoteButton(noteContainer)
    {
        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.innerText = messages.ADD_NOTE_BUTTON;

        addButton.onclick = () =>
        {
            const newNote = new Note();
            NoteManager.addNote(newNote);
            noteContainer.insertBefore(newNote.getElement(), addButton);
        };

        noteContainer.appendChild(addButton);
    }

    /**
     * Updates the time display showing when notes were last updated.
     * (Used in both Reading and Writing modes)
     */
    updateTimeDisplay(mode)
    {
        // Get the last updated element
        const lastUpdated = document.getElementById("lastUpdated");
        if (!lastUpdated) return;

        // Get the last updated time from NoteManager
        const last = NoteManager.getLastUpdated();

        // If there's no last updated time, clear the display
        if (!last)
        {
            lastUpdated.innerText = "";
            return;
        }

        // Convert the timestamp to a Date object
        const time = new Date(last);

        // Update the display based on the mode
        if (mode === consts.READING_MODE)
        {
            // Display "Last Updated" for reading mode
            lastUpdated.innerText = messages.LAST_UPDATED_LABEL + time.toLocaleTimeString();
        } else
        {
            // Display "Last Stored" for writing mode
            lastUpdated.innerText = messages.LAST_STORED_LABEL + time.toLocaleTimeString();
        }
    }
}

/**
 * Function to get the mode of the page (Reading or writing)
 * @return {string|null} - The mode of the page
 */
function getPageMode()
{
    const noteContainer = document.getElementById("noteContainer");

    if (noteContainer)
    {
        return noteContainer.getAttribute("data-mode");
    }
}

/**
 * Event listener for when the DOM content is loaded.
 * Initializes the UI and starts syncing notes.
 */
document.addEventListener("DOMContentLoaded", () =>
    {
        const mode = getPageMode();

        const ui = new UI(mode);

        window.addEventListener(consts.NOTES_UPDATED_KEY, () =>
        {
            ui.refreshNotes(mode)
        })

        NoteManager.startSyncingNotes(consts.SYNC_INTERVAL_MS, mode);

        setInterval(() => ui.updateTimeDisplay(mode), consts.SYNC_INTERVAL_MS);
    }
)

