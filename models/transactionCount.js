const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.databaseENV);

const Model = Sequelize.Model;
class TransactionCount extends Model {}
TransactionCount.init({
  txCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lastBlockChecked: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  company: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'transactionCount'
});

module.exports = TransactionCount;