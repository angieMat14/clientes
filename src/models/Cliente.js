const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      match: /^CLI[0-9]+$/,
    },
    nombre: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    fechaAlta: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  {
    collection: 'clientes',
    versionKey: false,
  },
);

module.exports = mongoose.model('Cliente', clienteSchema);
