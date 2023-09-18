var pool = require('./bd');


// muestra todos los productos de la BD en orden ascendente
async function getProductos() {
  var query = "select * from productos order by id asc";
  var rows = await pool.query(query);
  return rows;

}

// inserta cada producto en la BD
async function insertProducto(obj) {
  try {
    var query = "insert into productos set ? "
    var rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Elimina productos de la BD
async function deleteProductoById(id) {
  var query = "delete from productos where id = ?";
  var rows = await pool.query(query, [id]);
  return rows;
}

//Nos permite obtener una noticia única de la base de datos utilizando el id de la misma para seleccionarla. 
async function getProductoById(id) {
  var query = "select * from productos where id = ?";
  var rows = await pool.query(query, [id]);
  return rows[0];
}

//Modifica los campos del producto que seleccionemos por id y que recibe como parámetro.
async function modificarProductoById(obj, id) {
  try {
    var query = "update productos set ? where id=?";
    var rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getProductos, insertProducto, deleteProductoById, getProductoById, modificarProductoById }
