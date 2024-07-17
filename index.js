const express = require('express');
const { Database } = require('@sqlitecloud/drivers');
const cors = require('cors');


//Middleware para parsear JSON
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

//Habilitar CORS
app.use(cors());


const db = new Database('sqlitecloud://niixaltqiz.sqlite.cloud:8860?apikey=zM4z5b4LDtTFaXdFFQg3mbd0lquNiQmpR2Orh4gg870')
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
    const result = await db.sql`SELECT * FROM invitados;`;
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los invitados:', error);
    res.status(500).json({ error: 'Error al obtener los invitados' });
  }
})

app.get('/invitados/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.sql`SELECT * FROM invitados WHERE id = ${id};`;
    console.log(result);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Invitado no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el invitado:', error);
    res.status(500).json({ error: 'Error al obtener el invitado' });
  }
})
app.get('/invitados/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.sql`SELECT * FROM invitados WHERE id = ${id};`;
    console.log(result);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Invitado no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el invitado:', error);
    res.status(500).json({ error: 'Error al obtener el invitado' });
  }
})

app.put('/invitados/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, acompañante, niños, confirmacion } = req.body;
  try {
    const result = await db.sql`
      UPDATE invitados
      SET 
        nombre = ${nombre},
        acompañante = ${acompañante},
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