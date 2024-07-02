const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:password@localhost:3306/f1_updates_dev');

const User = require('./models/user')(sequelize, DataTypes);
const Driver = require('./models/driver')(sequelize, DataTypes);
const Update = require('./models/update')(sequelize, DataTypes);

// Sincronizar los modelos con la base de datos
sequelize.sync();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas para los usuarios
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Rutas para los pilotos
app.get('/api/drivers', async (req, res) => {
  const drivers = await Driver.findAll();
  res.json(drivers);
});

app.post('/api/drivers', async (req, res) => {
  const driver = await Driver.create(req.body);
  res.json(driver);
});

// Rutas para las actualizaciones
app.get('/api/updates', async (req, res) => {
  const updates = await Update.findAll({
    include: [User, Driver]
  });
  res.json(updates);
});

app.post('/api/updates', async (req, res) => {
  const update = await Update.create(req.body);
  res.json(update);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
