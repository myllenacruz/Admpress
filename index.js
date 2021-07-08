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
  res.render('index')
})

app.listen(9898, () => {
  console.log('Rodando!')
})
