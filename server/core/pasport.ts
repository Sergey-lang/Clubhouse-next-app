import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../../models';

console.log(User, 222);

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/github/callback'
  },
  async (_: unknown, __: unknown, profile, done) => {
    try {
      const obj = {
        fullname: profile.displayName,
        avatarUrl: profile.photos?.[0].value,
        isActive: 0,
        username: profile.username,
        phone: '',
      };

      const findUser = await User.findOne({
        where: {
          username: obj.username
        }
      });
      // create user
      if (!findUser) {
        const user = await User.create(obj);
        // if !error should add null to callback
        return done(null, user.toJSON());
      }
      // add existing user
      done(null, findUser);
    } catch (error) {
      done(error);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };
