const express = require('express');
const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');
const { parseListQuery } = require('./queryValidation');

const app = express();
const caseInsensitiveCollation = { locale: 'es', strength: 2 };

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'service_unavailable',
      message: 'La base de datos no está disponible.',
    });
  }

  return res.json({
    status: 'ok',
    service: process.env.SERVICE_NAME || 'microservicio-clientes',
    collection: 'clientes',
    version: '1.0.0',
  });
});

app.get(
  '/items',
  asyncHandler(async (req, res) => {
    const { ciudad, provincia, limit, offset } = parseListQuery(req.query);
    const filter = {};

    if (ciudad !== undefined) filter.ciudad = ciudad;
    if (provincia !== undefined) filter.provincia = provincia;

    const [total, items] = await Promise.all([
      Cliente.countDocuments(filter).collation(caseInsensitiveCollation),
      Cliente.find(filter)
        .collation(caseInsensitiveCollation)
        .sort({ id: 1 })
        .skip(offset)
        .limit(limit)
        .select('-_id -__v')
        .lean(),
    ]);

    res.json({ items, total, limit, offset });
  }),
);

app.get(
  '/items/:id',
  asyncHandler(async (req, res) => {
    const item = await Cliente.findOne({ id: req.params.id })
      .select('-_id -__v')
      .lean();

    if (!item) {
      return res.status(404).json({
        error: 'not_found',
        message: `No existe ${req.params.id}.`,
      });
    }

    return res.json(item);
  }),
);

app.use((req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: 'La ruta solicitada no existe.',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.statusCode === 400 && error.code === 'bad_request') {
    return res.status(400).json({
      error: error.code,
      message: error.message,
    });
  }

  console.error('Error procesando la solicitud:', error);
  return res.status(500).json({
    error: 'internal_server_error',
    message: 'Ocurrió un error interno del servidor.',
  });
});

module.exports = app;
