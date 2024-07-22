// functions/updateInvitado.js
const { Database } = require('@sqlitecloud/drivers');
require('dotenv').config();

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

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  const id = event.queryStringParameters.id;
  const { 
    nombre, apellido, celular, nombrefamilia, niños, confirmacion
  } = JSON.parse(event.body);

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
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Invitado actualizado correctamente' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invitado no encontrado' }),
      };
    }
  } catch (error) {
    console.error('Error al actualizar el invitado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el invitado' }),
    };
  }
};
