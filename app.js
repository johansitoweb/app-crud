const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/miBaseDeDatos', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number
});

const Item = mongoose.model('Item', itemSchema);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Crear un nuevo ítem
app.post('/items', (req, res) => {
  const nuevoItem = new Item(req.body);
  nuevoItem.save()
    .then(item => res.status(201).send(item))
    .catch(err => res.status(400).send(err));
});

// Leer todos los ítems
app.get('/items', (req, res) => {
  Item.find()
    .then(items => res.status(200).send(items))
    .catch(err => res.status(500).send(err));
});

// Leer un ítem específico por ID
app.get('/items/:id', (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      if (!item) return res.status(404).send();
      res.status(200).send(item);
    })
    .catch(err => res.status(500).send(err));
});

// Actualizar un ítem por ID
app.put('/items/:id', (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .then(item => {
      if (!item) return res.status(404).send();
      res.status(200).send(item);
    })
    .catch(err => res.status(400).send(err));
});

// Eliminar un ítem por ID
app.delete('/items/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(item => {
      if (!item) return res.status(404).send();
      res.status(200).send(item);
    })
    .catch(err => res.status(500).send(err));
});
