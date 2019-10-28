const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var hbs = exphbs.create({ /* config */ });

const app = express();
const users = require('./routes/users');



require('./config/passport')(passport); 
const db = require('./config/database')

// Connect to Mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/users', users);

// Landing page
app.get('/', (req, res) => {
    res.render('home')
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));