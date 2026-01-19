// Written by: Justin Cardas
// Date: 2026-01-16
// Other contributors: Gemini 3-pro (https://gemini.google.com)
// Description: This file contains the Note and NoteManager classes for lab 1.

import {consts} from "../lang/consts/consts.js";
import {messages} from "../lang/messages/en/user";

/**
 * Note class represents a single note in the application.
 * Each note has an ID, text content, and a DOM element for display.
 * @property {number} id - The unique identifier for the note
 * @property {string} text - The text content of the note
 * @property mode - The mode of the page (Reading/Writing)
 */
export class Note
{
    constructor(id = Date.now(), text = "", mode)
    {
        this.id = id;
        this.text = text;

        this.element = this.createNoteElement(mode);
    }

    /**
     * Creates the DOM element for the note based on the mode.
     *
     * @param mode - The mode of the page (Reading/Writing)
     * @returns {HTMLDivElement} - The note container element
     */
    createNoteElement(mode)
    {
        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container");

        // The actual note text
        const noteText = document.createElement("textarea");
        noteText.classList.add("note-text");
        noteText.value = this.text;

        // Along with updating the note every two seconds,
        // update whenever the user types in the box
        noteText.oninput = () =>
        {
            NoteManager.updateNote(this.id, noteText.value);
        };

        // Append the text area to the container
        noteContainer.appendChild(noteText);

        // Check the mode to see if we are reading or writing
        if (mode === consts.READING_MODE)
        {
            // In reading mode, make the text area readonly
            noteText.setAttribute("readonly", "readonly");

        } else if (mode === consts.WRITING_MODE)
        {
            // In writing mode, make the text area editable
            noteText.removeAttribute("readonly");

            // The button to remove the note
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.textContent = messages.REMOVE_BUTTON;

            // Onclick event to remove the note from the screen and storage.
            removeButton.onclick = () =>
            {
                this.removeNote();
            }
            noteContainer.appendChild(removeButton);
        }
        return noteContainer;
    }

    /**
     * Returns the DOM element for display purposes
     */
    getElement()
    {
        return this.element;
    }

    /**
     * Removes the note from the screen and from local storage.
     */
    removeNote()
    {
        // Remove the element from the screen
        this.element.remove();

        // Notify NoteManager to remove note from array
        NoteManager.removeNote(this.id);
    }
}

/**
 * NoteManager class handles the storage and retrieval of notes.
 * It stores an array of Note objects and the last updated timestamp.
 * It manages saving to and loading from local storage, as well as updating notes.
 * @property {Array<Note>} notes - The array of Note objects
 * @property {number} lastUpdated - The timestamp of the last update
 */
export class NoteManager
{
    // Static properties store the notes and last updated time
    static notes = [];
    static lastUpdated = Date.now();

    /**
     * Retrieves the last updated timestamp.
     * @returns {number}
     */
    static getLastUpdated()
    {
        return this.lastUpdated;
    }

    /**
     * Retrieves notes from local storage and returns them as an array of Note objects.
     *
     * (Consulted Gemini 3 pro (https://gemini.google.com) for steps in parsing json data.)
     * All comments / code is written by hand by me (Justin C)
     * @param mode - The mode of the page (Reading/Writing)
     * @returns - An array of Note objects
     */
    static getNotesFromLocalStorage(mode)
    {
        // Since the browser can only store strings, JSON.parse converts raw JSON
        // back into an array for use
        const storedNotes = JSON.parse(localStorage.getItem(consts.NOTES_STORAGE_KEY));
        if (storedNotes)
        {
            // the .map method loops through the raw data and feeds each JSON
            // entry into the Note object constructor.
            this.notes = storedNotes.map(note => new Note(note.id, note.text, mode));
        }

        // Finally returns an array of notes parsed from the JSON
        return this.notes;
    }

    /**
     * Saves the current notes array to local storage.
     *
     * (Consulted Gemini 3 pro (https://gemini.google.com) for steps in stringifying json data.)
     * All comments / code is written by hand by me (Justin C)
     */
    static saveNotesToLocalStorage()
    {
        // This converts the object data stored in the notes array
        // into a savable array for storage in the browser's local storage
        // by mapping the data to an array with only the necessary data.
        const savableNotes = this.notes.map(note => (
            {
                id: note.id,
                text: note.text
            }
        ));

        // Finally, the savable data array is converted to a string for JSON storage
        // (since JSON can only store strings)
        // and saved to local storage.
        localStorage.setItem(consts.NOTES_STORAGE_KEY, JSON.stringify(savableNotes));
    }

    /**
     * Updates the text of a specific note by its ID.
     * @param id - The ID of the note to update.
     * @param text - The new text for the note.
     */
    static updateNote(id, text)
    {
        // Finds the specific note object in the array
        const noteToUpdate = this.notes.find(note => note.id === id);

        if (noteToUpdate)
        {
            noteToUpdate.text = text; // Updates the text in the textArea
            this.saveNotesToLocalStorage(); // Save notes to local storage

            this.updateLastUpdated(); // Update last updated timestamp
        }
    }

    /**
     * Adds a new note to the notes array and updates local storage.
     * @param note - The note object to add.
     */
    static addNote(note)
    {
        this.notes.push(note); // Save note to array
        this.saveNotesToLocalStorage(); // Save notes to local storage
        this.updateLastUpdated(); // Update last updated timestamp
    }

    /**
     * Removes a note by its ID from the notes array and updates local storage.
     * @param id - The ID of the note to remove.
     */
    static removeNote(id)
    {
        this.notes = this.notes.filter(note => note.id !== id); // Remove note from array
        this.saveNotesToLocalStorage(); // Save notes to local storage
        this.updateLastUpdated(); // Update last updated timestamp
    }

    /**
     * Updates the last updated timestamp to the current time.
     */
    static updateLastUpdated()
    {
        this.lastUpdated = Date.now(); // Mark when the last update was made
    }

    /**
     * Starts the syncing process for notes based on the mode. (Reading/Writing)
     * @param interval - The interval in milliseconds for syncing
     * @param mode - The mode of the page (Reading/Writing)
     */
    static startSyncingNotes(interval, mode)
    {
        if (mode === consts.READING_MODE)
        {
            // In reading mode, we fetch notes from local storage at intervals
            // and dispatch a custom event to notify the UI to update.
            setInterval(() =>
            {
                this.getNotesFromLocalStorage(mode);

                this.updateLastUpdated();

                // This dispatches a custom event to notify the UI to refresh notes
                // It's used to refresh the notes displayed on the screen when in reading mode.
                window.dispatchEvent(new CustomEvent(consts.NOTES_UPDATED_KEY));
            }, interval);
        } else if (mode === consts.WRITING_MODE)
        {
            // In writing mode, we save notes to local storage at intervals
            // and update the last updated timestamp.
            setInterval(() =>
            {
                this.saveNotesToLocalStorage();
                this.updateLastUpdated();
            }, interval);
        }
    }
}