import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { nanoid } from 'nanoid';
import cors from 'cors';

//set env setting
dotenv.config({
  path: './server/.env'
});

import './core/db';

import { passport } from './core/pasport';
// + '-' +file.filename.split('.').pop()
const app = express();
const uploader = multer({
  storage: multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, 'public/avatars/');
    },
    filename: function (_, file, cb) {
      cb(null, file.fieldname + '-' + nanoid(6));
    }
  })
});

app.use(cors());
app.use(passport.initialize());

app.post('/upload', uploader.single('photo'), (req, res) => {
  res.json(req.file);
});

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(req.user)}', '*');window.close();</script>`);
  });

app.listen(3001, () => {
  console.log('SERVER RUNNED');
});
