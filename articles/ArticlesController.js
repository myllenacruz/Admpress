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

router.post('/articles/update', (req, res) => {
  let id = req.body.id
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category
  Article.update(
    { title: title, body: body, categoryId: category, slug: slugify(title) },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect('/admin/articles')
    })
    .catch((err) => {
      res.redirect('/')
    })
})

router.get('/articles/page/:num', (req, res) => {
  let page = req.params.num
  let offset = 0
  if (isNaN(page) || page <= 1) {
    offset = 0
  } else {
    offset = (parseInt(page) - 1) * 4
  }
  Article.findAndCountAll({
    limit: 4,
    offset: 12,
  }).then((articles) => {
    let next
    if (offset + 4 >= articles.count) {
      next = false
    } else {
      next = true
    }
    let result = {
      next: next,
      articles: articles,
    }
    res.json(result)
  })
})

module.exports = router
