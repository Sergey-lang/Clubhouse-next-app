import express from 'express';
import dotenv from 'dotenv';

//set env setting
dotenv.config({
  path: './server/.env'
});

import './core/db';

import { passport } from './core/pasport';

const app = express();

app.use(passport.initialize());

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(req.user)}', '*');window.close();</script>`)
  });

app.listen(3001, () => {
  console.log('SERVER RUNNED');
});
