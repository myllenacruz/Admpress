const express = require('express')
const app = express()
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')

app.set('view engine', 'ejs')

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

app.get('/', (req, res) => {
  Article.findAll().then((articles) => {
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

app.listen(9898, () => {
  console.log('Rodando!')
})
