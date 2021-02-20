import React, { FormEvent, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.global.css';
import {
  Card,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { Create } from '@material-ui/icons';
import Store, { Schema } from 'electron-store';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Task from './components/Task';
import Note from './components/Note';

const { v4: uuidv4 } = require('uuid');

const schema = {
  notes: {
    type: 'array',
    default: [
      {
        id: '1',
        title: 'Test',
        content: 'good',
      },
    ],
  },
} as Schema<unknown>;

const store = new Store({ schema });
let unsubscribe = store.onDidChange('notes', () => {});
function sendNotification(taskName: string) {
  return new Notification('Task Due', {
    body: `Task ${taskName} is now due`,
  });
}
function checkDue() {
  store.get('notes').forEach((note: Record<string, string>) => {
    if (
      new Date(note.title).toString() !== 'Invalid Date' &&
      new Date(note.title) < new Date()
    ) {
      sendNotification(note.content);
    }
  });
}
checkDue();
setInterval(checkDue, 3600000);

const Index = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [useDate, setUseDate] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState(store.get('notes'));

  unsubscribe();
  unsubscribe = store.onDidChange('notes', (newValue) => setNotes(newValue));
  function deleteNote(id: string) {
    store.set(
      'notes',
      (store.get('notes') as Array<Record<string, string>>).filter(
        (note) => note.id !== id
      )
    );
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    store.set('notes', [
      ...(store.get('notes') as Array<Record<string, string>>),
      { title: useDate ? date : title, content, id: uuidv4() },
    ]);
    setShowCompose(false);
    setTitle('');
    setContent('');
  }
  function updateNote(id: string, noteTitle: string, noteContent: string) {
    store.set('notes', [
      ...(store.get('notes') as Array<Record<string, string>>).filter(
        (note) => note.id !== id
      ),
      { title: noteTitle, content: noteContent, id: uuidv4() },
    ]);
  }

  return (
    <div>
      <Card style={{ padding: '10px' }}>
        <IconButton
          onClick={() => setShowCompose(!showCompose)}
          style={{ float: 'right' }}
        >
          <Create />
        </IconButton>
        <h2>Alex&apos;s First Desktop App!</h2>
      </Card>
      {showCompose && (
        <Card style={{ marginTop: '10px', padding: '10px' }}>
          <form onSubmit={onSubmit}>
            {useDate ? (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  variant="inline"
                  required
                  value={date}
                  onChange={setDate}
                  id="date-picker-inline"
                  style={{ width: '100%' }}
                  label="When"
                  format="MM/dd/yyyy"
                  name="title"
                  minDate={new Date()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            ) : (
              <TextField
                required
                style={{ width: '100%' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                label="Title"
                variant="outlined"
                id="Title"
              />
            )}
            <TextField
              multiline
              required
              style={{ marginTop: '10px', width: '100%' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              variant="outlined"
              id="Content"
            />
            <Button
              aria-label="Submit"
              style={{ float: 'right', marginTop: '10px' }}
              variant="outlined"
              type="submit"
            >
              Submit
            </Button>
            <FormControlLabel
              style={{
                float: 'right',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
              label="Date"
              labelPlacement="start"
              control={
                <Switch
                  checked={useDate}
                  onChange={(e) => setUseDate(e.target.checked)}
                  name="checkedA"
                />
              }
            />
          </form>
        </Card>
      )}
      <ul style={{ listStyleType: 'none', padding: '0px' }}>
        {(notes as Array<Record<string, string>>).map((note) => (
          <li key={note.id}>
            {new Date(note.title).toString() === 'Invalid Date' ? (
              <Note
                note={note}
                deleteNote={deleteNote}
                updateNote={updateNote}
              />
            ) : (
              <Task
                note={note}
                deleteNote={deleteNote}
                updateNote={updateNote}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Route path="/" component={Index} />
    </Router>
  );
}
