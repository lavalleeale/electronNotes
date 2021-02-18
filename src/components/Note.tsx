import React, { FormEvent, useState } from 'react';
import '../App.global.css';
import { Card, IconButton, TextField, Button } from '@material-ui/core';
import { Create, Delete, CancelScheduleSend } from '@material-ui/icons';
import PropTypes from 'prop-types';

const Note = ({
  deleteNote,
  note,
  updateNote,
}: {
  deleteNote: (arg0: string) => void;
  note: Record<string, string>;
  updateNote: (arg0: string, arg1: string, arg2: string) => void;
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateNote(note.id, title, content);
  }
  const [showEditor, setShowEditor] = useState(false);
  return (
    <Card style={{ marginTop: '10px', padding: '10px' }}>
      {showEditor ? (
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
            Update
          </Button>
          <IconButton
            onClick={() => setShowEditor(false)}
            style={{ float: 'right' }}
          >
            <CancelScheduleSend />
          </IconButton>
        </form>
      ) : (
        <>
          <IconButton
            onClick={() => deleteNote(note.id)}
            style={{ float: 'right' }}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => setShowEditor(true)}
            style={{ float: 'right' }}
          >
            <Create />
          </IconButton>
          <h3>{note.title}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '16px' }}>
            {note.content}
          </pre>
        </>
      )}
    </Card>
  );
};

Note.propTypes = {
  deleteNote: PropTypes.func.isRequired,
  note: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  updateNote: PropTypes.func.isRequired,
};

export default Note;
