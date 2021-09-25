import express from 'express';
import { Code, User } from '../../models';

class AuthController {
  getMe(req: express.Request, res: express.Response) {
    res.json(req.user);
  }

  authCallback(req: express.Request, res: express.Response) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`);
  }

  async activate(req: express.Request, res: express.Response) {
    const userId = req.user.id;
    const { code, user } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Введите код активации' });
    }

    const whereQuery = { code, user_id: userId };

    try {
      const findCode = await Code.findOne({
        where: whereQuery
      });

      if (findCode) {
        await Code.destroy({
          where: whereQuery
        });
        await User.update({ ...user, isActive: 1 }, { where: { id: userId } });
        return res.send();
      } else {
        res.send(400).json({
          message: 'Код не найден',
        });
      }

    } catch (error) {
      res.send(500).json({
        message: 'Ошибка при активация аккаунта',
      });
    }
  }

  async getUserInfo(req: express.Request, res: express.Response) {
    const userId = req.params.id;

    try {
      const findUser = await User.findByPk(userId);

      if (findUser) {
        res.json(await findUser);
      } else {
        res.status(400).json({
          message: 'Пользователь не найден',
        });
      }

    } catch (error) {
      res.send(500).json({
        message: 'Ошибка получения информации о пользователе',
      });
    }
  }

  async sentSms(req: express.Request, res: express.Response) {
    const phone = req.query.phone;
    const userId = req.user.id;
    // const smsCode = generateRandomCode();
    const smsCode = 1234;
    if (!phone) {
      return res.status(400).json({
        message: 'Номер телефона не указан',
      });
    }

    try {
      // TODO: request to sms service api
      // await Axios.get(
      //   ``
      // );

      const findCode = await Code.findOne({
        where: {
          user_id: userId,
        }
      });

      if (findCode) {
        return res.status(400).json({ message: 'Код уже был отправлен' });
      }

      await Code.create({
        // code: generateRandomCode(),
        code: smsCode,
        user_id: userId
      });

      res.status(201).send();
    } catch (error) {
      res.send(500).json({
        message: 'Ошибка при отправке СМС-кода'
      });
    }
  }
}

export default new AuthController();
