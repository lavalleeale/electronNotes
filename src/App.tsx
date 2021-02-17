import React, { FormEvent, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { Card, IconButton, TextField, Button } from '@material-ui/core';
import { Create } from '@material-ui/icons';
import Store, { Schema } from 'electron-store';
import { v4 as uuidv4 } from 'uuid';
import Note from './components/note';

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

const Index = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState(store.get('notes'));
  store.onDidChange('notes', (newValue) => setNotes(newValue));
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
      { title, content, id: uuidv4() },
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
            <TextField
              required
              style={{ width: '100%' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              variant="outlined"
              id="Title"
            />
            <TextField
              required
              style={{ marginTop: '10px', width: '100%' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              variant="outlined"
              id="Content"
            />
            <Button
              aria-label={navigator.onLine ? 'Submit' : 'No Connection'}
              disabled={!navigator.onLine}
              style={{ float: 'right', marginTop: '10px' }}
              variant="outlined"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Card>
      )}
      <ul style={{ listStyleType: 'none', padding: '0px' }}>
        {(notes as Array<Record<string, string>>).map((note) => (
          <li key={note.id}>
            <Note note={note} deleteNote={deleteNote} updateNote={updateNote} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Index} />
      </Switch>
    </Router>
  );
}
