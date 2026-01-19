export class Note
{
    constructor(id = Date.now(), text = "", mode)
    {
        this.id = id;
        this.text = text;

        this.element = this.createNoteElement(mode);
    }

    createNoteElement(mode)
    {
        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container");

        // The actual note text
        const noteText = document.createElement("textarea");
        noteText.classList.add("note-text");
        noteText.value = this.text;

        // Instead of updating the note every two seconds,
        // update whenever the user types in the box
        noteText.oninput = () =>
        {
            NoteManager.updateNote(this.id, noteText.value);
        };

        noteContainer.appendChild(noteText);

        // Check the mode to see if we are reading or writing
        if (mode === "reading")
        {
            noteText.setAttribute("readonly", "readonly");

        } else if (mode === "writing")
        {
            noteText.removeAttribute("readonly");
            // The button to remove the note
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.textContent = "Remove";

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
 * Note manager has static methods, since there is only one not manager
 */
export class NoteManager
{
    // Static properties store varaiables
    static notes = [];
    static lastUpdated = Date.now();

    static loadNotesFromLocalStorage(mode)
    {
        // Consulted Gemini 3 pro (https://gemini.google.com) for steps in parsing json data.
        // All comments are written by hand by me (Justin C)

        // Since the browser can only store strings, JSON.parse converts raw JSON
        // back into an array for use
        const storedNotes = JSON.parse(localStorage.getItem("notes"));
        if (storedNotes)
        {
            // the .map method loops through the raw data and feeds each JSON
            // entry into the Note object constructor.
            this.notes = storedNotes.map(note => new Note(note.id, note.text, mode));
        }

        // Finally returns an array of notes parsed from the JSON
        return this.notes;
    }

    static saveNotesToLocalStorage()
    {
        // This converts the object data stored in the notes array
        // into JSON string data for storage in the browser's local storage
        // by mapping the data to an array with only the necessary data.
        const savableNotes = this.notes.map(note => (
            {
                id: note.id,
                text: note.text
            }
        ));

        // Finally, the data array is converted to a string for JSON storage
        // (since JSON can only store strings)
        // and saved to local storage.
        localStorage.setItem("notes", JSON.stringify(savableNotes));
    }

    static updateNote(id, text)
    {
        // Finds the specific note object in the array
        const noteToUpdate = this.notes.find(note => note.id === id);

        if (noteToUpdate)
        {
            noteToUpdate.text = text; // Updates the text in the textArea
            this.saveNotesToLocalStorage();
            this.updateLastUpdated();
        }
    }

    static addNote(note)
    {
        this.notes.push(note);
        this.saveNotesToLocalStorage();
        this.updateLastUpdated();
    }

    static removeNote(id)
    {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotesToLocalStorage();
        this.updateLastUpdated();
    }

    static updateLastUpdated()
    {
        this.lastUpdated = Date.now(); // Mark when the last update was made
    }
}