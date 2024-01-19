import React, {useState, useEffect} from 'react';
import './App.css';
import Preview from './component/Preview';
import Message from './component/Message';
import NoteContainer from './component/Notes/NoteContainer';
import NoteList from './component/Notes/NoteList';
import Note from './component/Notes/Note';
import NoteForm from './component/Notes/NoteForm';
import Alert from './component/Alert';

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Validation Errors
  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if(!title) {
      validationErrors.push('Please enter your note title');
      passed = false;
    }
    if(!content) {
      validationErrors.push('Please enter your note Content');
      passed = false;
    }

    setValidationErrors(validationErrors)
    return passed;
  }

  // Locale Storage
  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')))
    } else { 
      localStorage.setItem('notes', JSON.stringify([]))
    }
  },[])

  const saveToLocaleStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove Alert Before 3 Seconds
  useEffect(() => {
    if(validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([])
      },3000)
    }
  }, [validationErrors])


  // Add Note Handler
  function addNoteHandler() {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  // Change Title Value Note
  const changeTitleHandler = (event) => {
    setTitle(event.target.value)
  }

  // Change Content Value Note
  const changeContentHandler = (event) => {
    setContent(event.target.value)
  }

  // Save Note Handler
  const saveNoteHandler = () => {

    if(!validate()) return;
    const note = {
      id: new Date(),
      title: title,
      content: content
    }

    const updateNote = [...notes, note];

    saveToLocaleStorage('notes', updateNote);
    setNotes(updateNote);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('')
  }

  // Select Note Handler
  const selectNoteHandler = (noteId) => {
    setSelectedNote(noteId)
    setCreating(false)
    setEditing(false)
  }

  // Change to Edit Note Handler
  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote)
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  // Edit Note Handler
  const updateNoteHandler = () => {
    if(!validate()) return;
    const updatedNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote)

    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    }

    saveToLocaleStorage('notes', updatedNotes)
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('')
  }

  // Delete Note Handler
  const deleteNoteHandler = () => {
    const updatedNotes = [...notes];
    const deleteNoteIndex = updatedNotes.findIndex(note => note.id === selectedNote);

    notes.splice(updatedNotes[deleteNoteIndex], 1)

    saveToLocaleStorage('notes', notes)
    setNotes(notes);
    setSelectedNote(null)
  }

  const getAddNote = () => {

    return (
      <div>
        <NoteForm 
            formTitle='Add new note'
            title={title}
            content={content}
            titleChanged={changeTitleHandler}
            contentChanged={changeContentHandler}
            submitClick={saveNoteHandler}
            submitText='New note'
          />
      </div>
    );
  };

  const getPreview = () => {
    if(notes.length === 0) {
      return (
        <Message title='No Note Found' />
      )
    }

    if(!selectedNote) {
      return (
        <Message title='Please Select Note' />
      )
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    })

    let noteDisplay = (
          <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
      )

    if(editing) {
      noteDisplay = (
        <div>
          <NoteForm 
            formTitle='Edit Note'
            title={title}
            content={content}
            titleChanged={changeTitleHandler}
            contentChanged={changeContentHandler}
            submitClick={updateNoteHandler}
            submitText='Edit'
          />
        </div>
      )

    } 

    return (
      <div>
        {!editing && 
        <div className="note-operations">
          <a href="#" onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#">
            <i className="fa fa-trash" onClick={deleteNoteHandler}/>
          </a>
        </div>
        }
        
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NoteContainer>
        <NoteList>
          {notes.map(note => <Note 
                                key={note.id}
                                title={note.title}
                                noteClicked={() => selectNoteHandler(note.id)}
                                active={selectedNote === note.id}
                              />
          )}
        </NoteList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NoteContainer>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationErrors={validationErrors}/>}
    </div>
  );
}

export default App;
