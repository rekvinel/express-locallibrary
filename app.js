require('dotenv').config()

const helmet = require("helmet");
const express = require('express');
const connectDB = require('./db');
const path = require('path');
const RateLimit = require("express-rate-limit");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog");

const compression = require("compression");
const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      "style-src": ["'self'", "cdn.jsdelivr.net"],
    },
  })
);


const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 хвилина
  max: 20, // максимум 20 запитів на хвилину
});
app.use(limiter);

app.use(compression()); // Увімкнути gzip/deflate

app.use(express.static(path.join(__dirname, "public")));

// Налаштування шаблонізатора
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Підключення до бази
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Маршрути
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);


// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
});
