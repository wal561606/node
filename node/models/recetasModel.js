var pool = require('./bd');

// muestra todos los recetas de la BD en orden ascendente
async function getRecetas() {
  var query = "select * from recetas order by id asc";
  var rows = await pool.query(query);
  return rows;

}

// inserta cada Receta en la BD
async function insertReceta(obj) {
  try {
    var query = "insert into recetas set ? "
    var rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Elimina recetas de la BD
async function deleteRecetaById(id) {
  var query = "delete from recetas where id = ?"
  var rows = await pool.query(query, [id]);
  return rows;
}

//Nos permite obtener una noticia única de la base de datos utilizando el id de la misma para seleccionarla. 
async function getRecetaById(id) {
  var query = "select * from recetas where id = ?";
  var rows = await pool.query(query, [id]);
  return rows[0];
}

//Modifica los campos de Recetas que seleccionemos por id y que recibe como parámetro.
async function modificarRecetaById(obj, id) {
  try {
    var query = "update recetas set ? where id=?";
    var rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getRecetas, insertReceta, deleteRecetaById, getRecetaById, modificarRecetaById }