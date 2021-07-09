const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category, required: true }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles: articles })
  })
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/articles/new', { categories: categories })
  })
})

router.get('/admin/articles/edit/:id', (req, res) => {
  let id = req.params.id
  if (isNaN(id)) {
    res.redirect('/')
  }

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('admin/articles/edit', {
            categories: categories,
            article: article,
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch((erro) => {
      res.redirect('/')
    })
})

router.post('/articles/save', (req, res) => {
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category
  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/delete', (req, res) => {
  let id = req.body.id
  if (id != undefined) {
    Article.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect('/admin/articles')
    })
    if (!isNaN(id)) {
    } else {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

module.exports = router
