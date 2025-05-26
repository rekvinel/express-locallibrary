// Імпортуємо модель Genre
const Genre = require('../models/genre');
const Book = require("../models/book");
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

// Показати список всіх жанрів
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', {
      title: 'Список жанрів',
      genre_list: allGenres,
    });
  });

// Показати деталі конкретного жанру
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Отримання деталей жанру та всіх пов'язаних книг (паралельно)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // Немає результатів.
    const err = new Error("Жанр не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Деталі жанру",
    genre: genre,
    genre_books: booksInGenre,
  });
});


// Відображення форми створення жанру на GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", {
    title: "Створити жанр",
    genre: {}
  });
};

// Обробити створення жанру (POST)
exports.genre_create_post = [
  // Валідація і санітизація поля name
  body("name", "Назва жанру повинна містити принаймні 3 символи.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Створення об'єкта жанру з очищеними даними
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Є помилки — повторно відображаємо форму з даними і помилками
      res.render("genre_form", {
        title: "Створити жанр",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }

    // Перевірка, чи вже існує жанр з такою назвою
    const genreExists = await Genre.findOne({ name: req.body.name }).collation({ locale: "en", strength: 2 }).exec();

    if (genreExists) {
      // Якщо вже існує — перенаправити на сторінку існуючого жанру
      res.redirect(genreExists.url);
    } else {
      // Інакше — зберігаємо і перенаправляємо на нову сторінку жанру
      await genre.save();
      res.redirect(genre.url);
    }
  })
];

// Показати форму для видалення жанру (GET)
exports.genre_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Обробити видалення жанру (POST)
exports.genre_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Показати форму для оновлення жанру (GET)
exports.genre_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Обробити оновлення жанру (POST)
exports.genre_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
