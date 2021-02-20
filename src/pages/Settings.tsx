import React, { useState, FormEvent } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import Store, { Schema } from 'electron-store';
import { Link, Redirect } from 'react-router-dom';
import '../App.global.css';

const schema = {
  settings: {
    type: 'object',
    default: { delay: 3600000, notificationTime: 7200000 },
  },
} as Schema<unknown>;

const store = new Store({ schema, name: 'settings' });

store.clear();

export default function Settings() {
  const [notificationTime, setNotificationTime] = useState(
    `${store.get('settings.notificationTime') / 3600000}`
  );
  const [finished, setFinished] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    store.set(
      'settings.notificationTime',
      `${parseInt(notificationTime, 10) * 3600000}`
    );
    e.preventDefault();
    setFinished(true);
  }

  return (
    <>
      {finished && <Redirect to="/" />}
      <Card style={{ padding: '10px' }}>
        <h2>Settings</h2>
      </Card>
      <Card style={{ padding: '10px', marginTop: '10px' }}>
        <form onSubmit={onSubmit}>
          <TextField
            required
            type="number"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            style={{ width: '100%', marginTop: '10px' }}
            label="Time Between Notifications (hours)"
            variant="outlined"
            id="wait"
          />
          <Button
            type="submit"
            variant="outlined"
            style={{ float: 'right', margin: '10px' }}
          >
            Submit
          </Button>
          <Link to="/">
            <Button
              variant="outlined"
              style={{ float: 'right', margin: '10px' }}
            >
              Revert
            </Button>
          </Link>
        </form>
      </Card>
    </>
  );
}
