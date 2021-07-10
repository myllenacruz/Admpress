const express = require('express')
const app = express()
const session = require('express-session')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UsersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

app.set('view engine', 'ejs')

app.use(
  session({
    secret: 'kjkmoc',
    cookie: { maxAge: 3000000 },
  })
)

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connection
  .authenticate()
  .then(() => {
    console.log('Tudo ok!')
  })
  .catch((error) => {
    console.log(error)
  })

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', { articles: articles, categories: categories })
    })
  })
})

app.get('/:slug', (req, res) => {
  let slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('article', { article: article, categories: categories })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch((err) => {
      res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
  let slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render('index', {
            articles: category.articles,
            categories: categories,
          })
        })
      } else {
        res.params.redirect('/')
      }
    })
    .catch((err) => {
      res.redirect('/')
    })
})

app.listen(9898, () => {
  console.log('Rodando!')
})
