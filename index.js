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


app.get('/invitados', async (req, res) => {
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

app.put('/invitados/:id', async (req, res) => {
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
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})