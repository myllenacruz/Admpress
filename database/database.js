const Sequelize = require('sequelize')
const connection = new Sequelize('admpress', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

module.exports = connection
