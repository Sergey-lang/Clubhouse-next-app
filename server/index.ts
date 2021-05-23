import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import { nanoid } from 'nanoid';
import cors from 'cors';
import { Code } from '../models';

declare global {
  namespace Express {
    interface User extends UserData {

    }
  }
}

dotenv.config({
  path: './server/.env'
});

import './core/db';

import { passport } from './core/passport';
import { UserData } from '../pages';
import { Axios } from '../core/axios';

const app = express();
const uploader = multer({
  storage: multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, 'public/avatars/');
    },
    filename: function (_, file, cb) {
      cb(null, file.fieldname + '-' + nanoid(6) + '.' + file.mimetype.split('/').pop());
    }
  })
});

const randomCode = (max: number = 9999, min: number = 1000) => Math.floor(Math.random() * (max - min + 1)) + min;

app.use(cors());
app.use(express.json);
app.use(passport.initialize());

app.post('/upload', uploader.single('photo'), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)
    .toFormat('jpeg')
    .toFile(filePath.replace('.png', '.jpeg'), (err) => {
      if (err) {
        throw err;
      }
      fs.unlinkSync(filePath);

      res.json({
        url: `/avatars/${req.file.filename.replace('.png', 'jpeg')}`
      });
    });
});

app.get('/auth/sms/activate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.user.id;
  const smsCode = req.query.code;

  if (!smsCode) {
    return res.status(400).send();
  }

  const whereQuery = { code: smsCode, user_id: userId };

  try {
    const findCode = await Code.findOne({
      where: whereQuery
    });

    if (findCode) {
      await Code.destroy({
        where: whereQuery
      });
      res.send();
    } else {
      throw new Error('User not found');
    }

  } catch (error) {
    res.send(500).json({
      message: 'Ошибка при активация аккаунта'
    });
  }
});

app.get('/auth/me',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
  });

app.get('/auth/sms', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const phone = req.query.phone;
  const userId = req.user.id;
  const smsCode = randomCode();

  if (!phone) {
    return res.send(400).send();
  }

  try {
    // await Axios.get(
    //   ``
    // );
    await Code.create({
      code: randomCode(),
      user_id: userId
    });

    res.status(201).send();
  } catch (error) {
    res.send(500).json({
      message: 'Ошибка при отправке СМС-кода'
    });
  }
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
