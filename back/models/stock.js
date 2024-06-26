const mongoose = require("../database/index.js");

// Definição do modelo do usuário
const StockSchema = new mongoose.Schema({
  login: {
    type: String,
  },
  senha: {
    type: String,
  },
  ea: {
    type: Number,
  },
  nivel: {
    type: Number,
  },
  skins: {
    type: String,
  },
  servidor: {
    type: String,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
