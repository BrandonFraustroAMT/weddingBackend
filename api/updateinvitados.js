// api/updateInvitado.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Database } = require('@sqlitecloud/drivers');

const app = express();
app.use(express.json());
app.use(cors());

const db = new Database(process.env.DB);
const connect = async () => {
  try {
    await db.sql`USE DATABASE wedding-database;`;
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

connect();

app.put('/api/invitados/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { 
    nombre, apellido, celular, nombrefamilia, niños, confirmacion
  } = req.body;
  try {
    const result = await db.sql`
      UPDATE invitado
      SET 
        nombre = ${nombre},
        apellido = ${apellido},
        celular = ${celular},
        nombrefamilia = ${nombrefamilia},
        niños = ${niños},
        confirmacion = ${confirmacion}
      WHERE id = ${id};
    `;
    if (result.changes > 0) {
      res.json({ message: 'Invitado actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Invitado no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el invitado:', error);
    res.status(500).json({ error: 'Error al actualizar el invitado' });
  }
});

module.exports = app;
