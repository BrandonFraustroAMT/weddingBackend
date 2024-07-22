require('dotenv').config();
const express = require('express');
const { Database } = require('@sqlitecloud/drivers');
const cors = require('cors');


//Middleware para parsear JSON
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

//Habilitar CORS
app.use(cors());


const db = new Database(process.env.DB)
const connect = async () => {
  try {
    await db.sql`USE DATABASE wedding-database;`;
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

// Llamar a la función para verificar la conexión al iniciar el servidor
connect();


app.get('/api', async (req, res) => {
  res.send('Prueba')
})

module.exports = app;