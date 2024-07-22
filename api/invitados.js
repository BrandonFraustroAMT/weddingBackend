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

app.get('/api/invitados', async (req, res) => {
  try {
    const result = await db.sql`
    SELECT
      i.id AS ID,
      i.nombre AS invitado_nombre, 
      i.apellido AS invitado_apellido, 
      i.celular, 
      i.nombrefamilia, 
      i.niños, 
      a.nombre AS acompanante_nombre, 
      a.apellido AS acompanante_apellido,
      i.confirmacion AS confirmacion
    FROM 
      acompañante AS a
    FULL JOIN 
      invitado AS i ON i.id = a.invitado_id;
    `;
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los invitados:', error);
    res.status(500).json({ error: 'Error al obtener los invitados' });
  }
})

module.exports = app;