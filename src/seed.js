require('dotenv').config();

const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientes';

async function seed() {
  await mongoose.connect(mongoUri);
  await Cliente.updateOne(
    { id: 'CLI001' },
    {
      $setOnInsert: {
        id: 'CLI001',
        nombre: 'Lucía Fernández',
        email: 'lucia.fernandez@example.com',
        ciudad: 'Bahía Blanca',
        provincia: 'Buenos Aires',
        fechaAlta: '2025-03-12',
      },
    },
    { upsert: true, runValidators: true },
  );
  console.log('Registro de ejemplo CLI001 disponible en la colección clientes.');
}

seed()
  .catch((error) => {
    console.error('No fue posible cargar el registro de ejemplo:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
