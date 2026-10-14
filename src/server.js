require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const port = Number(process.env.PORT || 3000);
const mongoUri =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientes';

async function start() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Microservicio de clientes disponible en http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('No fue posible iniciar el microservicio:', error);
  process.exitCode = 1;
});
