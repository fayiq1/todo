const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const path=require("path");

const methodOverride = require('method-override');




// Load config
require('dotenv').config();
require('./config/passport')(passport);

// DB Config
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const app = express();
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Add to your middleware
app.locals.isPastDeadline = (deadline) => {
  return deadline && new Date(deadline) < new Date();
};

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Make user available in all views
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/todos', require('./routes/todos'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));