/**
* Let's run through the functions one by one. Don't attempt to read everything
* in one go! Understand what each function does before moving on.
*
* Below is a line that is highly recommended you add to the top of all your
* scripts. It helps you avoid some common mistakes by throwing errors when you
* make them. Read more here - https://goo.gl/yyPsjZ
*/
'use strict';
/**
 * Declare some global variables.
 *
 * notes will be an array of Objects, that stores all of the information
 * Objects are key-value pairs, similar to struct in C/C++.
 *
 * noteCount is NOT the the number of notes - it's an integer that always
 * increments, so we can assign each note a unique id
 *
 * priorityClasses is a convinent way to map our background colors to the
 * priorities. We'll see later how this is useful.
 */
var notes = [];
var noteCount = 1;
var priorityClasses = {
    3 : 'high',
    2 : 'medium',
    1 : 'low',
};
/**
 * Call a function that restores our previous notes from localStorage on
 * loading the page. It checks if there's an existing notes array stored, and
 * loads it if there is. We use the "load" eventListener to check for when the
 * page loads and execute a function.
 *
 * We use the JSON format to convert arrays and objects into a string, so that
 * we can store them. noteAdd is a function that's defined later.
 */
window.addEventListener("load",function () {
    var storedNotes = localStorage.getItem("notes");
    if(storedNotes) {
        notes = JSON.parse(storedNotes);
        noteCount = Number(localStorage.getItem('noteCount'));
        for(var i = 0; i < notes.length; ++i) {
            noteAdd(notes[i]);
        }
    }
});
/**
* This function is called when we want to create a new note
*/
function noteCreate() {
    /**
    * Lets create a new object to hold the new note, and give it values from
    * the HTML. We can use querySelector to do this. There are other functions
    * for this as well, like getElementById, getElementsByClassName, etc.
    *
    * We can see here that each note has four properties.
    * id -> A unique id for each note
    * title -> The note querySelectorAllle
    * content -> The main message of the note
    * priority -> A number from 3 to 1
    */
    var newNote = {}
    newNote.id       = noteCount;
    newNote.title    = document.querySelector('.title').value;
    newNote.content  = document.querySelector('.content').value;
    newNote.priority = Number(document.querySelector('.priority').value);
    /**
    * Let's increment noteCount for the next note, and add this note into our
    * main notes array. The noteAdd function will take this JavaScript Object
    * and actually put it into our webpage. noteStore is for updating these
    * changes into localStorage. We'll define it later.
    */
    noteCount++;
    notes.push(newNote);
    noteAdd(newNote);
    noteStore();
}
/**
* This function takes a note object, turns it into DOM, and puts it
* in the HTML. We can never use JavaScript objects or variables
* directly into HTML. Everything has to use the DOM functions and objects.
*/
function noteAdd(note) {
    /**
    * Make some new DOM objects
    */
    var newNoteContainer   = document.createElement('div');
    var newNoteBody        = document.createElement('div');
    var newNoteTitle       = document.createElement('h2');
    /**
    * Set the content of these objects based on the note object that was passed
    */
    newNoteTitle.innerHTML = note.title;
    newNoteBody.innerHTML  = note.content;
    /**
     * Set class names for the objects. This will also help us when we write CSS
     */
    newNoteContainer.className = "note";
    newNoteTitle.className     = "note-title";
    newNoteBody.className      = "note-body";
    /**
     * Use the unique note id as a HTML id for convinence
     */
    newNoteContainer.id = "note-"+note.id;
    /**
     * Let's append our title and content divs to out main note container
     * We also set a class that's based on the priority. These are the classes
     * that give the background color. You can see this in the CSS
     */
    newNoteContainer.appendChild(newNoteTitle);
    newNoteContainer.appendChild(newNoteBody);
    newNoteContainer.className += " " + priorityClasses[note.priority];
    /**
     * Creating DOM Objects and appending them is one way to add HTML.  Another
     * way is to directly type the HTML into a string and append it to the
     * innerHTML property. These elements have been styled to be at the top
     * right corner
     */
    newNoteContainer.innerHTML += '<button title="Edit" class="note-button note-edit" onclick="noteEditStart(event)">📝</button>';
    newNoteContainer.innerHTML += '<button title="Close" class="note-button note-close" onclick="noteDelete(event)">✘</button>';
    /**
     * Finally, we place the object that we've build into the actual document.
     */
    document.querySelector('#notes-container').appendChild(newNoteContainer);
}
/**
 * Delete a note. Notice that we pass an event as the argument
 * This is passed from the HTML, and makes it easy for us to find out which
 * note the delete click came from
 */
function noteDelete(event) {
    /**
     * event.target gives us where the click came from, that's the button We
     * need to delete the note, which is a parent tag of the button.
     *
     * We use the .remove() function to remove the element.
     */
    var elementToDelete = event.target.parentNode;
    elementToDelete.remove();
    /**
     * We've deleted it from the DOM. Delete it from out notes array as well
     *
     * Remember we assigned a unique HTML id to each note? We can use that here
     * to get the unique of the note, and find it in the notes array. The HTML
     * is is in the format note-{number}, so the split() function is a way to
     * get {number}
     *
     * splice(i,1) is a simple way to delete the ith element
     */
    var elementCountId = Number(elementToDelete.id.split('-')[1]);
    for (var i = notes.length - 1; i >= 0; --i) {
        if(notes[i].id === elementCountId) {
            notes.splice(i, 1);
            break;
        }
    }
    noteStore();
}
/**
 * Function called when edit is pressed on a note
 */
function noteEditStart(event) {
    /**
     * This function and the next one are more complicated than the previous
     * ones, so follow along carefully! We find the note that clicked, just
     * like before
     */
    var elementToEdit = event.target.parentNode;
    var elementCountId = Number(elementToEdit.id.split('-')[1]);
    var currentNote = {};
    /**
     * Let's find that note in the notes array
     */
    for (var i = notes.length - 1; i >= 0; --i) {
        if(notes[i].id === elementCountId) {
            currentNote = notes[i];
            break;
        }
    }
    /**
     * Now, we want to replace the content of the notes with input boxes, so
     * that the user can now edit the content. Basically, we just remove the
     * content of the note and put the input boxes we used to create the note
     * there instead, so that the user can change it. We also add a 'Finish
     * Edit' button, that sets the new values.
     *
     * First, clear the note completely
     */
    elementToEdit.innerHTML = "";
    /**
     * Add our input boxes. Notice that we prefill each input with values from
     * the notes array that we have. 
     * 
     * There's a cleaner way to do this, without polluting out JavaScript
     * without so much HTML, using Templates. This is usally best with some
     * external libraries, so we haven't done that here. If you'd like to
     * explore templates, visit ->
     * https://developer.mozilla.org/en/docs/JavaScript_templates
     */
    elementToEdit.innerHTML += '<input class="title" value="'+currentNote.title+'"></input>';
    elementToEdit.innerHTML += '<textarea class="content">'+currentNote.content+'</textarea>';
    elementToEdit.innerHTML += '<select name="priority" class="priority">' +
                               '<option value="3">High</option>' +
                               '<option value="2">Medium</option>' +
                               '<option value="1">Low</option>' +
                               '</select>';
    elementToEdit.innerHTML += '<button onclick="noteEditFinish(event)">Finish Edit</button>';
    /**
     * Set the value of the priority dropdown as well, and we're done!
     */
    elementToEdit.getElementsByTagName('select')[0].value = currentNote.priority;
}
/**
 * This function is called when we're done editing the notes
 */
function noteEditFinish(event) {
    /**
     * Same drill. This is the opposite of the previous function. We'll restore
     * the note.
     *.
     * There, we read from the array and replaced the note with input boxes.
     * Here, we replaces the input boxes with the new note and write to the
     * array.
     *
     * If you've been following along till now, there's nothing new in this
     * function.
     */
    var elementToEdit = event.target.parentNode;
    var elementCountId = Number(elementToEdit.id.split('-')[1]);

    var newTitle    = elementToEdit.querySelectorAll('input')[0].value;
    var newContent  = elementToEdit.querySelectorAll('textarea')[0].value;
    var newPriority = elementToEdit.querySelectorAll('select')[0].value;

    var newNoteBody        = document.createElement('div');
    var newNoteTitle       = document.createElement('h2');

    newNoteTitle.innerHTML = newTitle;
    newNoteBody.innerHTML  = newContent;

    newNoteTitle.className     = "note-title";
    newNoteBody.className      = "note-body";

    for (var i = notes.length - 1; i >= 0; --i) {
        if(notes[i].id === elementCountId) {
            notes[i].title = newTitle;
            notes[i].content = newContent;
            break;
        }
    }

    elementToEdit.innerHTML = "";

    elementToEdit.appendChild(newNoteTitle);
    elementToEdit.appendChild(newNoteBody);

    elementToEdit.innerHTML += '<button title="Edit" class="note-button note-close" onclick="noteDelete(event)">✘</button>';
    elementToEdit.innerHTML += '<button title="Close" class="note-button note-edit" onclick="noteEditStart(event)">📝</button>';

    elementToEdit.className = "note " + priorityClasses[newPriority];

    noteStore();
}
/**
 * Function called when the sort button is pressed
 */
function noteSort() {
    /**
     * To perform sorting on an array of objects, we must define a comparison
     * function to specify which property we are sorting based on, which here
     * is priority. If you've used vector.sort() in C++, this should be
     * familiar.
     */
    var compare = function(a,b) {
        if (a.priority < b.priority)
            return 1;
        if (a.priority > b.priority)
            return -1;
        return 0;
    }
    /**
     * Here'e the line that does the actual sorting
     */
    notes = notes.sort(compare);
    /**
     * Let's add the sorted notes back into HTML with our trusty noteAdd function
     */
    document.querySelector('#notes-container').innerHTML = "";
    for(var i = 0; i < notes.length; ++i) {
        noteAdd(notes[i]);
    }
    noteStore();
}
/**
 * Store the notes in localStorage after JSONification
 *
 * The JSON.stringify function takes any javascript value, like an Object or an
 * Array, and converts it to the JSON format, which is a string. We can only
 * store strings in localStorage
 */
function noteStore() {
    localStorage.setItem('notes',JSON.stringify(notes));
    localStorage.setItem('noteCount',String(noteCount));
}
