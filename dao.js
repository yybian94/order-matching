var Sequelize = require('sequelize');
var mysql = require('mysql2');

/*const sequelize = new Sequelize('dazzling-reach-176517:asia-east1:matched-orders', 'root', 'password', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  dialectOptions: {
    "socketPath": "/cloudsql/dazzling-reach-176517:asia-east1:matched-orders"
  },

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});*/


var sequelize = new Sequelize('orders', 'root', 'chali', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});



const Entry = sequelize.define('entry', {
  buy: {
    type: Sequelize.STRING
  },
  sell: {
    type: Sequelize.STRING
  }, coin_slug: {
    type: Sequelize.STRING
  }, amount: {
    type: Sequelize.INTEGER
  }
});


var dao = function(toWrite){
      toWrite.results.forEach(function(result){
        result.matches.forEach(function(match){
          Entry.sync({force: true}).then(() => {
            return Entry.create({
              jobId: toWrite.jobId,
              buy: match.buy,
              sell: match.sell,
              amount: match.amount,
              price: result.price
            });
          });
        })
      })
}