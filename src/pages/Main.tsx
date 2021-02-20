import React, { FormEvent, useState } from 'react';
import '../App.global.css';
import {
  Card,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { Add, Settings } from '@material-ui/icons';
import Store, { Schema } from 'electron-store';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Link } from 'react-router-dom';
import Task from '../components/Task';
import Note from '../components/Note';

const { v4: uuidv4 } = require('uuid');

const schema = {
  notes: {
    type: 'array',
    default: [
      {
        id: '1',
        lastNotificationTime: 0,
        title: 'Test',
        content: 'good',
      },
    ],
  },
} as Schema<unknown>;

const store = new Store({ schema, name: 'notes' });
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
      new Date(note.title) < new Date() &&
      new Date(
        note.lastNotificationTime + store.get('settings.notificationTime')
      ) < new Date()
    ) {
      store.set('notes', [
        ...(store.get('notes') as Array<Record<string, string>>).filter(
          (checkNote) => checkNote.id !== note.id
        ),
        {
          title: note.title,
          content: note.content,
          id: note.id,
          lastNotificationTime: new Date().getTime(),
        },
      ]);
      sendNotification(note.content);
    }
  });
}
checkDue();
setInterval(checkDue, 60000);

export default function Main() {
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
      {
        title: useDate ? date : title,
        content,
        id: uuidv4(),
        lastNotificationTime: 0,
      },
    ]);
    setShowCompose(false);
    setTitle('');
    setContent('');
  }
  function updateNote(
    id: string,
    noteTitle: string,
    noteContent: string,
    lastNotificationTime: string
  ) {
    store.set('notes', [
      ...(store.get('notes') as Array<Record<string, string>>).filter(
        (note) => note.id !== id
      ),
      {
        title: noteTitle,
        content: noteContent,
        id: uuidv4(),
        lastNotificationTime: parseInt(lastNotificationTime, 10),
      },
    ]);
  }

  return (
    <div>
      <Card style={{ padding: '10px' }}>
        <IconButton
          onClick={() => setShowCompose(!showCompose)}
          style={{ float: 'right' }}
        >
          <Add />
        </IconButton>
        <Link to="settings">
          <IconButton style={{ float: 'right' }}>
            <Settings />
          </IconButton>
        </Link>
        <h2>Notes Ace</h2>
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
}
