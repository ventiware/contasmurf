const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const sgMail = require("@sendgrid/mail");
app.use(cors());
app.use(bodyParser.json());

// Dados sensiveis
require("dotenv").config();
const chaveSecreta = process.env.TOKEN_JWT;
sgMail.setApiKey(process.env.SENDGRID_KEY);

// Middlewares
const verifyToken = require("./middlewares/verifyToken");

// Models
const User = require("./models/user");
const Stock = require("./models/stock");
const StockPBE = require("./models/stockPBE");
const Cart = require("./models/cart");

// Rota de registro de Estoque
app.post("/api/stock", verifyToken, async (req, res) => {
  const { login, senha, ea, skins, nivel, servidor } = req.body;
  // Verificar se o conta já existe no banco de dados
  const existingStock = await Stock.findOne({
    login,
    senha,
    ea,
    skins,
    nivel,
    servidor,
  });
  if (existingStock) {
    return res.status(400).json({ message: "Estoque já registrado" });
  }

  // Criar a nova conta no banco de dados
  const newStock = new Stock({ login, senha, ea, skins, nivel, servidor });
  await newStock.save();

  res.json({ message: "Estoque adicionado com sucesso" });
});

// Rota de autenticação de usuário
app.get("/api/stock", async (req, res) => {
  const listStock = await Stock.find();
  res.send(listStock);
});

// Rota de registro de Estoque PBE
app.post("/api/stockpbe", verifyToken, async (req, res) => {
  const { login, senha, ea, skins, nivel, servidor } = req.body;
  // Verificar se o conta já existe no banco de dados
  const existingStockPBE = await Stock.findOne({
    login,
    senha,
    ea,
    skins,
    nivel,
    servidor,
  });
  if (existingStockPBE) {
    return res.status(400).json({ message: "Estoque já registrado" });
  }

  // Criar a nova conta no banco de dados
  const newStockPBE = new StockPBE({
    login,
    senha,
    ea,
    skins,
    nivel,
    servidor,
  });
  await newStockPBE.save();

  res.json({ message: "Estoque adicionado com sucesso" });
});

// Rota de estoque PBE
app.get("/api/stockpbe", async (req, res) => {
  const listStockPBE = await StockPBE.find();
  res.send(listStockPBE);
});

// Rota de registro de usuário
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar se o usuário já existe no banco de dados
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: "E-mail ou usuario já registrado" });
  }

  // Criptografar a senha antes de salvar no banco de dados
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar o novo usuário no banco de dados
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  res.json({ message: "Usuário registrado com sucesso" });
});

// Rota de autenticação de usuário
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Verificar as credenciais do usuário

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  // Função para gerar o token JWT
  function generateToken(user) {
    return jwt.sign({ userId: user._id }, chaveSecreta, {
      expiresIn: "1h",
    });
  }

  res.json({ userId: user._id, token: generateToken(user) });
});

// Rota de listagem de usuários
app.get("/api/accounts", verifyToken, async (req, res) => {
  const listAcoounts = await User.find();
  res.send(listAcoounts);
});

app.post("/api/recuperarnome", (req, res) => {
  const { to, from, subject, text } = req.body;

  // Crie o objeto de e-mail
  const email = {
    to,
    from,
    subject,
    text,
  };

  // Envie o e-mail
  sgMail
    .send(email)
    .then(() => {
      console.log("E-mail enviado com sucesso");
      res.status(200).json({ message: "E-mail enviado com sucesso" });
    })
    .catch((error) => {
      console.error("Erro ao enviar o e-mail", error);
      res.status(500).json({ error: "Erro ao enviar o e-mail" });
    });
});

// Rota para adicionar um item ao carrinho

app.post("/api/cart", verifyToken, async (req, res) => {
  const { userId, quantity, price, name } = req.body;

  try {
    const cartItem = new Cart({
      userId: userId,
      price: price,
      name: name,
      quantity: quantity,
    });

    await cartItem.save();

    const itemId = cartItem._id; // Obtém o _id gerado pelo MongoDB

    const response = {
      itemId: itemId,
      ...cartItem.toObject(),
    };

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao adicionar o item ao carrinho" });
  }
});

app.get("/api/cart", verifyToken, async (req, res) => {
  const userId = req.query.userId;
  const itemId = req.query.itemId;

  try {
    let cartQuery = { userId: userId };
    if (itemId) {
      cartQuery._id = itemId;
    }

    const cart = await Cart.findOne(cartQuery);
    if (!cart) {
      res.status(404).json({ message: "Esse itemId não foi encontrado" });
      return;
    }

    const response = {
      itemId: cart._id,
      ...cart.toObject(),
    };

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao obter os itens do carrinho" });
  }
});

app.delete("/api/cart", verifyToken, async (req, res) => {
  const userId = req.query.userId;
  const itemId = req.query.itemId;

  try {
    const result = await Cart.deleteOne({ userId: userId, _id: itemId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Esse itemId não foi encontrado" });
      return;
    }
    res.status(200).json({ message: "Item removido do carrinho com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao remover o item do carrinho" });
  }
});

app.put("/api/cart", verifyToken, async (req, res) => {
  const itemId = req.query.itemId;
  const userId = req.query.userId;
  const { quantity, price, name } = req.body;

  try {
    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: itemId, userId: userId },
      { quantity: quantity, price: price, name: name },
      { new: true }
    );

    if (!updatedCartItem) {
      res.status(404).json({ message: "Esse itemId não foi encontrado" });
      return;
    }

    const response = {
      itemId: updatedCartItem._id,
      ...updatedCartItem.toObject(),
    };

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao atualizar o item do carrinho" });
  }
});

app.get("/api/cartlist", verifyToken, async (req, res) => {
  try {
    const cartList = await Cart.find();
    if (cartList.length === 0) {
      res
        .status(404)
        .json({ message: "Nenhum item no carrinho foi encontrado" });
      return;
    }
    res.send(cartList);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao obter a lista do carrinho" });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
