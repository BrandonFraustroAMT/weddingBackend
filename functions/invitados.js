// functions/invitados.js
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
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error al obtener los invitados:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener los invitados' }),
    };
  }
};
