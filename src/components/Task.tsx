import React, { FormEvent, useState } from 'react';
import '../App.global.css';
import { Card, IconButton, TextField, Button } from '@material-ui/core';
import { Create, Delete, CancelScheduleSend } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const dateio = new DateFnsUtils();
const Note = ({
  deleteNote,
  note,
  updateNote,
}: {
  deleteNote: (arg0: string) => void;
  note: Record<string, string>;
  updateNote: (arg0: string, arg1: string, arg2: string, arg3: string) => void;
}) => {
  const [title, setTitle] = useState<Date | null>(new Date(note.title));
  const [content, setContent] = useState(note.content);
  const [showEditor, setShowEditor] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateNote(
      note.id,
      title ? title.toLocaleString() : 'error',
      content,
      note.lastNotificationTime
    );
  }
  return (
    <Card style={{ marginTop: '10px', padding: '10px' }}>
      {showEditor ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <form onSubmit={onSubmit}>
            <DateTimePicker
              required
              value={title}
              onChange={setTitle}
              style={{ width: '100%' }}
              label="When"
              name="title"
              minDate={new Date()}
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
        </MuiPickersUtilsProvider>
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
          <h3>{dateio.format(new Date(note.title), "MMMM dd'th' p")}</h3>
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
    lastNotificationTime: PropTypes.number,
  }).isRequired,
  updateNote: PropTypes.func.isRequired,
};

export default Note;
