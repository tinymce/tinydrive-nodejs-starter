const express = require('express');
const mustacheExpress = require('mustache-express');
const portfinder = require('portfinder');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const config = require('./config');
const fs = require('fs');

const setupExpress = (port) => {
  const app = express();

  app.engine('mustache', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/views');

  app.set('trust proxy', 1);
  app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: false }));

  setupRoutes(app);

  app.listen(port, () => console.log(`Tiny Drive starter project is now available at: http://localhost:${port}/`));  
};

const setupRoutes = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/editor', (req, res) => {
    if (req.session.user) {
      res.render('editor', { apiKey: config.apiKey, fullname: req.session.user.fullname });
    } else {
      res.redirect('/');
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.post('/jwt', (req, res) => {
    const user = req.session.user;
    if (user) {
      const payload = {
        sub: user.username,        // Unique user id string
        name: user.fullname,       // Full name of user
        exp: Math.floor(Date.now() / 1000) + (60 * 10) // 10 minutes expiration
      };

      // When this is set the user will only be able to manage and see files in the specified root
      // directory. This makes it possible to have a dedicated home directory for each user.
      if (config.scopeUser) {
        payload['https://claims.tiny.cloud/drive/root'] = `/${user.username}`;
      }

      try {
        const privateKey = fs.readFileSync(config.privateKeyFile).toString();
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256'});
        res.json({ token });
      } catch (e) {
        res.status(500);
        res.send('Failed generate jwt token.');
        console.error(e.message);
      }
    } else {
      res.status(401);
      res.send('Could not produce a jwt token since the user is not logged in.');
    }
  });

  app.post('/', (req, res) => {
    const user = config.users.find(({ username, password }) => username === req.body.username && password === req.body.password);
    if (user) {
      req.session.user = user;
      res.redirect('/editor');
    } else {
      res.render('index', { error: 'Incorrect username or password.' })
    }
  });
};

portfinder.getPort({
  port: 3000,
  stopPort: 4000
}, (err, port) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(-1);
  } else {
    setupExpress(port);
  }
});
