const express = require('express');
let router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

// Configure cookie-session middleware
router.use(cookieSession({
    name: 'session',
    keys: ['session'], // Replace with your own secret keys
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// bug in express password - not related - https://stackoverflow.com/a/75195471
router.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

router.use(passport.initialize());
router.use(passport.session());

// In-memory user store for demonstration purposes
const users = [];

// Passport local strategy configuration
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        const user = users.find(u => u.email === email);
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Routes
router.get('/', (req, res) => {
    res.redirect('/cookie/profile');
});

router.get('/login', (req, res) => {
    res.send(`<h1>Login Form</h1>
            ${req.query.reg ? '<p>Registration successful. Please log in.</p>' : '' }
            ${req.query.fail ? '<p>User or password not in database. Try again.</p>' : '' }
            <form action="/cookie/login" method="post">
            <div>
              <label>Username:</label>
              <input type="text" name="email"/><br/>
            </div>
            <div>
              <label>Password:</label>
              <input type="password" name="password"/><br/>
            </div>
            <div>
              <input type="submit" value="Log In"/>
            </div>
          </form><a href="./register">Do you need an account?</a>`);
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/cookie/profile',
        failureRedirect: '/cookie/login?fail=true'
    })
);

router.get('/register', (req, res) => {
    res.send('<h1>Register Form</h1><form action="/cookie/register" method="post">\
            <div>\
              <label>Username:</label>\
              <input type="text" name="email"/><br/>\
            </div>\
            <div>\
              <label>Password:</label>\
              <input type="password" name="password"/><br/>\
            </div>\
            <div>\
              <input type="submit" value="Register"/>\
            </div>\
          </form><a href="./login">Login Instead</a>');
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword
    };
    users.push(newUser);
    res.redirect('/cookie/login?reg=true');
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.email}. <a href="/cookie/logout">Logout</a>`);
    } else {
        res.redirect('/cookie/login');
    }
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/cookie');
    });
});

module.exports = router;
